import {
  AuthenticationGuard,
  CognitoAuthModule,
  CognitoUser,
} from "@nestjs-cognito/auth";
import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { GraphQLModule, Query, Resolver } from "@nestjs/graphql";
import { Test } from "@nestjs/testing";
import { GqlCognitoUser } from "../lib";

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
  me(@GqlCognitoUser("username") username: string) {
    return username;
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
