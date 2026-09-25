import {
  Authentication,
  AuthenticationGuard,
  Authorization,
  CognitoAuthModule,
  CognitoUser,
} from "@nestjs-cognito/auth";
import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { GraphQLModule, Query, Resolver } from "@nestjs/graphql";
import { Test } from "@nestjs/testing";

@Controller()
class HttpController {
  @Get("me")
  me(@CognitoUser("username") username: string) {
    return { username };
  }
}

@Resolver()
class MeResolver {
  @Query(() => String)
  me(@CognitoUser("username") username: string) {
    return username;
  }
}

@Resolver()
@Authentication()
class OrdersResolver {
  @Query(() => String)
  orderOwner(@CognitoUser("username") username: string) {
    return username;
  }

  @Query(() => String)
  @Authorization({ requiredScopes: ["orders/admin"] })
  adminOrders() {
    return "admin";
  }
}

describe("one global AuthenticationGuard for HTTP and GraphQL", () => {
  let app: INestApplication;
  let url: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
        CognitoAuthModule.register({}),
      ],
      controllers: [HttpController],
      providers: [
        MeResolver,
        { provide: APP_GUARD, useClass: AuthenticationGuard },
      ],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useValue({
        verify: async () => ({
          sub: "user-id",
          username: "john",
          token_use: "access",
        }),
      })
      .compile();
    app = moduleRef.createNestApplication({ logger: false });
    await app.listen(0);
    url = (await app.getUrl()).replace("[::1]", "localhost");
  });

  afterAll(() => app.close());

  const headers = {
    authorization: "Bearer token",
    "content-type": "application/json",
  };

  it("protects HTTP routes", async () => {
    expect(await (await fetch(`${url}/me`, { headers })).json()).toEqual({
      username: "john",
    });
    expect((await fetch(`${url}/me`)).status).toBe(401);
  });

  it("protects GraphQL operations", async () => {
    const query = (h: Record<string, string>) =>
      fetch(`${url}/graphql`, {
        method: "POST",
        headers: { "content-type": "application/json", ...h },
        body: JSON.stringify({ query: "{ me }" }),
      }).then((res) => res.json());

    expect(await query(headers)).toEqual({ data: { me: "john" } });
    expect((await query({})).errors[0].message).toBe(
      "No authentication credentials provided",
    );
  });
});

describe("@nestjs-cognito/auth decorators on resolvers", () => {
  let app: INestApplication;
  let url: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
        CognitoAuthModule.register({}),
      ],
      providers: [OrdersResolver],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useValue({
        verify: async () => ({
          sub: "client",
          client_id: "client",
          username: "john",
          token_use: "access",
          scope: "orders/read",
        }),
      })
      .compile();
    app = moduleRef.createNestApplication({ logger: false });
    await app.listen(0);
    url = (await app.getUrl()).replace("[::1]", "localhost");
  });

  afterAll(() => app.close());

  const query = (q: string) =>
    fetch(`${url}/graphql`, {
      method: "POST",
      headers: {
        authorization: "Bearer token",
        "content-type": "application/json",
      },
      body: JSON.stringify({ query: q }),
    }).then((res) => res.json());

  it("authenticates and resolves the user", async () => {
    expect(await query("{ orderOwner }")).toEqual({
      data: { orderOwner: "john" },
    });
  });

  it("authorizes by scope", async () => {
    expect((await query("{ adminOrders }")).errors[0].message).toBe(
      "Forbidden resource",
    );
  });
});
