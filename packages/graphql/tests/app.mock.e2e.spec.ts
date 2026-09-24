import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { request, spec } from "pactum";
import { CognitoTestingModule } from "../../testing/lib/cognito-testing.module";
import { AppModule } from "./app.module";

describe("Cognito Module : GraphQL (Mocked)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CognitoTestingModule.register(
          {},
          {
            enabled: true,
            user: {
              username: "flipper",
              email: "flipper@example.com",
              groups: ["dolphin"],
            },
          },
        ),
        AppModule,
      ],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useFactory({
        factory: CognitoTestingModule.createJwtVerifierFactory,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0);
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    request.setBaseUrl(url);

    await spec()
      .post("/cognito-testing-login")
      .withBody({
        username: "flipper@example.com",
        password: "password",
        clientId: "test-client",
      })
      .expectStatus(200)
      .stores("flipperToken", "IdToken");
  });

  afterAll(async () => {
    await app.close();
  });

  const query = (gql: string) =>
    spec()
      .post("/graphql")
      .withGraphQLQuery(gql)
      .withHeaders("Content-Type", "application/json");

  describe("authentication", () => {
    it("should resolve the current user from the token payload", async () => {
      await query(`query { getMeFromPayload { username email groups } }`)
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({
          data: {
            getMeFromPayload: {
              username: "flipper",
              email: "flipper@example.com",
              groups: ["dolphin"],
            },
          },
        });
    });

    it("should resolve a single property from the token payload", async () => {
      await query(`query { getEmailFromPayload }`)
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({ data: { getEmailFromPayload: "flipper@example.com" } });
    });

    it("should reject a request without a token", async () => {
      await query(`query { getEmailFromPayload }`)
        .expectStatus(200)
        .expectJsonLike({
          data: null,
          errors: [{ message: "No authentication credentials provided" }],
        });
    });
  });

  describe("authorization", () => {
    it("should allow a user from a required group", async () => {
      await query(`query { getFlipper { message } }`)
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({ data: { getFlipper: { message: "Flipper" } } });
    });

    it("should reject a user from a prohibited group", async () => {
      await query(`query { getRay { message } }`)
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectJsonLike({
          data: null,
          errors: [{ message: "Forbidden resource" }],
        });
    });
  });
});
