import {
  Authentication,
  CognitoAuthModule,
  CognitoUser,
} from "@nestjs-cognito/auth";
import {
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
  CookieJwtExtractor,
} from "@nestjs-cognito/core";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule, Query, Resolver, Subscription } from "@nestjs/graphql";
import { Test } from "@nestjs/testing";
import { createClient } from "graphql-ws";
import WebSocket from "ws";

@Resolver()
class NotificationsResolver {
  @Query(() => String)
  ping() {
    return "pong";
  }

  @Subscription(() => String, { resolve: (username: string) => username })
  @Authentication()
  notificationAdded(@CognitoUser("username") username: string) {
    return (async function* () {
      yield username;
    })();
  }
}

async function start(jwtExtractor?: CookieJwtExtractor) {
  const moduleRef = await Test.createTestingModule({
    imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: true,
        subscriptions: { "graphql-ws": true },
      }),
      CognitoAuthModule.register({ jwtExtractor }),
    ],
    providers: [NotificationsResolver],
  })
    .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
    .useValue({
      verify: async (token: string) => {
        if (token !== "valid") throw new Error("invalid token");
        return { sub: "user-id", username: "john", token_use: "access" };
      },
    })
    .compile();
  const app = moduleRef.createNestApplication({ logger: false });
  await app.listen(0);
  return app;
}

async function subscribe(
  app: INestApplication,
  options: {
    connectionParams?: Record<string, string>;
    headers?: Record<string, string>;
  },
) {
  const url = (await app.getUrl())
    .replace("[::1]", "localhost")
    .replace("http", "ws");
  const headers = options.headers;
  const client = createClient({
    url: `${url}/graphql`,
    connectionParams: options.connectionParams,
    webSocketImpl: class extends WebSocket {
      constructor(address: string, protocols?: string | string[]) {
        super(address, protocols, { headers });
      }
    },
  });
  try {
    return await new Promise((resolve) => {
      client.subscribe(
        { query: "subscription { notificationAdded }" },
        {
          next: resolve,
          error: (error) => resolve({ error }),
          complete: () => undefined,
        },
      );
    });
  } finally {
    await client.dispose();
  }
}

describe("GraphQL subscriptions (graphql-ws)", () => {
  it("reads the token from connectionParams", async () => {
    const app = await start();

    expect(
      await subscribe(app, {
        connectionParams: { authorization: "Bearer valid" },
      }),
    ).toEqual({ data: { notificationAdded: "john" } });
    await app.close();
  });

  it("rejects a subscription without a token", async () => {
    const app = await start();
    const result = (await subscribe(app, {})) as {
      errors: { message: string }[];
    };

    expect(result.errors[0].message).toBe(
      "No authentication credentials provided",
    );
    await app.close();
  });

  it("reads the token from the connection cookies", async () => {
    const app = await start(new CookieJwtExtractor("access_token"));

    expect(
      await subscribe(app, { headers: { cookie: "access_token=valid" } }),
    ).toEqual({ data: { notificationAdded: "john" } });
    await app.close();
  });
});
