import fastifyCookie from "@fastify/cookie";
import {
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
  CookieJwtExtractor,
} from "@nestjs-cognito/core";
import {
  Controller,
  Get,
  INestApplication,
  Type,
  UseFilters,
} from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import {
  ClientProxyFactory,
  MessagePattern,
  Payload,
  Transport,
} from "@nestjs/microservices";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Test } from "@nestjs/testing";
import { firstValueFrom } from "rxjs";
import { io } from "socket.io-client";
import {
  Authentication,
  AuthenticationGuard,
  CognitoAuthModule,
  CognitoRpcExceptionFilter,
  CognitoUser,
  CognitoWsExceptionFilter,
  PublicRoute,
} from "../lib";

const verifier = {
  verify: async (token: string) => {
    if (token !== "valid") throw new Error("invalid token");
    return { sub: "user-id", username: "john", token_use: "access" };
  },
};

@Controller()
class HttpController {
  @Get("private")
  private(@CognitoUser("username") username: string) {
    return { username };
  }

  @Get("public")
  @PublicRoute()
  public() {
    return { ok: true };
  }
}

@WebSocketGateway()
@UseFilters(CognitoWsExceptionFilter)
class Gateway {
  @SubscribeMessage("whoami")
  @Authentication()
  whoami(@CognitoUser("username") username: string) {
    return { username };
  }
}

@Controller()
@UseFilters(CognitoRpcExceptionFilter)
class RpcController {
  @MessagePattern("whoami")
  @Authentication()
  whoami(@CognitoUser("username") username: string, @Payload() data: object) {
    return { username, data };
  }
}

const globalGuard = { provide: APP_GUARD, useClass: AuthenticationGuard };

async function compile(
  controllers: Type[],
  providers: object[] = [],
  jwtExtractor?: CookieJwtExtractor,
) {
  return Test.createTestingModule({
    imports: [CognitoAuthModule.register({ jwtExtractor })],
    controllers,
    providers: providers as Type[],
  })
    .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
    .useValue(verifier)
    .compile();
}

async function baseUrl(app: INestApplication) {
  return (await app.getUrl()).replace(/\[::1\]|127\.0\.0\.1/, "localhost");
}

async function get(
  app: INestApplication,
  path: string,
  headers: Record<string, string> = {},
) {
  const res = await fetch((await baseUrl(app)) + path, { headers });
  return { status: res.status, body: await res.json() };
}

describe("global guard", () => {
  it("protects every route and honours @PublicRoute", async () => {
    const moduleRef = await compile([HttpController], [globalGuard]);
    const app = moduleRef.createNestApplication({ logger: false });
    await app.listen(0);

    expect((await get(app, "/private")).status).toBe(401);
    expect(
      await get(app, "/private", { authorization: "Bearer valid" }),
    ).toEqual({ status: 200, body: { username: "john" } });
    expect((await get(app, "/public")).status).toBe(200);
    await app.close();
  });
});

describe("Fastify", () => {
  it("reads the bearer token", async () => {
    const moduleRef = await compile([HttpController], [globalGuard]);
    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
      { logger: false },
    );
    await app.listen(0);

    expect(
      await get(app, "/private", { authorization: "Bearer valid" }),
    ).toEqual({ status: 200, body: { username: "john" } });
    expect((await get(app, "/private")).status).toBe(401);
    await app.close();
  });

  it("reads the cookie with @fastify/cookie", async () => {
    const moduleRef = await compile(
      [HttpController],
      [globalGuard],
      new CookieJwtExtractor("access_token"),
    );
    const app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
      { logger: false },
    );
    await app.register(fastifyCookie);
    await app.listen(0);

    expect(
      await get(app, "/private", { cookie: "access_token=valid" }),
    ).toEqual({ status: 200, body: { username: "john" } });
    await app.close();
  });
});

describe("socket.io", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = (await compile([], [Gateway])).createNestApplication({
      logger: false,
    });
    await app.listen(0);
  });

  afterAll(() => app.close());

  async function whoami(options: {
    extraHeaders?: Record<string, string>;
    auth?: Record<string, string>;
  }) {
    const client = io(await baseUrl(app), {
      ...options,
      transports: ["websocket"],
    });
    try {
      return await new Promise((resolve) => {
        client.on("exception", (error: unknown) => resolve({ error }));
        client.emit("whoami", {}, (ack: unknown) => resolve({ ack }));
      });
    } finally {
      client.close();
    }
  }

  it("reads the Authorization header", async () => {
    expect(
      await whoami({ extraHeaders: { authorization: "Bearer valid" } }),
    ).toEqual({ ack: { username: "john" } });
  });

  it("reads auth.token, which browsers can send", async () => {
    expect(await whoami({ auth: { token: "valid" } })).toEqual({
      ack: { username: "john" },
    });
  });

  it("sends the 401 to the client through CognitoWsExceptionFilter", async () => {
    expect(await whoami({})).toEqual({
      error: {
        statusCode: 401,
        message: "No authentication credentials provided",
        error: "Unauthorized",
      },
    });
  });
});

describe("TCP microservice", () => {
  let app: INestApplication;
  const port = 40000 + Math.floor(Math.random() * 10000);
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { port },
  });

  beforeAll(async () => {
    app = (await compile([RpcController])).createNestApplication({
      logger: false,
    });
    app.connectMicroservice({ transport: Transport.TCP, options: { port } });
    await app.startAllMicroservices();
    await app.init();
  });

  afterAll(async () => {
    client.close();
    await app.close();
  });

  it("reads data.headers.authorization without modifying the message", async () => {
    const data = { headers: { authorization: "Bearer valid" } };

    expect(await firstValueFrom(client.send("whoami", data))).toEqual({
      username: "john",
      data,
    });
  });

  it("sends the 401 to the client through CognitoRpcExceptionFilter", async () => {
    await expect(firstValueFrom(client.send("whoami", {}))).rejects.toEqual({
      statusCode: 401,
      message: "No authentication credentials provided",
      error: "Unauthorized",
    });
  });
});
