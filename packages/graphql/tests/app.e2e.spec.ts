import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { request, spec } from "pactum";
import { AppModule } from "./app.module";

describe("Cognito Module : GraphQL", () => {
  let app: INestApplication;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    config = moduleFixture.get<ConfigService>(ConfigService);

    await app.listen(0);
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    request.setBaseUrl(url);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("auth/me", () => {
    it("should be successfull and return the current user", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("AccessToken")
        .stores("flipperToken", "AccessToken");
      await spec()
        .get("/auth/me")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({
          _username: "8dd0d4e0-6175-40e4-a1d2-71b8c77c7121",
          _email: "flipper@dolphin.com",
          _groups: ["dolphin"],
        });
    });

    it("should be unsuccessfull because authorization header is missing", async () => {
      await spec().get("/auth/me").expectStatus(401);
    });
  });

  describe("dolphin: authorization", () => {
    describe("flipper", () => {
      it("should be unsuccessfull because ray is not in the dolphin group", async () => {
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: config.get("RAY_EMAIL"),
            password: config.get("RAY_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          })
          .expectStatus(201)
          .expectBodyContains("AccessToken")
          .stores("flipperToken", "AccessToken");
        await spec()
          .get("/graphql")
          .withGraphQLQuery(
            `query GetFlipper {
            getFlipper {
              message
            }
          }`
          )
          .withHeaders("Authorization", "$S{flipperToken}")
          .expectStatus(200)
          .expectJsonLike({
            errors: [],
          });
      });
      it("should be successfull because user is in the dolphin group", async () => {
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: config.get("FLIPPER_EMAIL"),
            password: config.get("FLIPPER_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          })
          .expectStatus(201)
          .expectBodyContains("AccessToken")
          .stores("flipperToken", "AccessToken");
        await spec()
          .post("/graphql")
          .withGraphQLQuery(
            `query GetFlipper {
            getFlipper {
              message
            }
          }`
          )
          .withHeaders("Authorization", "$S{flipperToken}")
          .expectStatus(200)
          .expectJson({
            data: {
              getFlipper: {
                message: "Flipper",
              },
            },
          });
      });
    });
    describe("position", () => {
      it("should be available to authenticated users, except for shark's members", async () => {
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: config.get("FLIPPER_EMAIL"),
            password: config.get("FLIPPER_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          })
          .expectStatus(201)
          .expectBodyContains("AccessToken")
          .stores("flipperToken", "AccessToken");
        await spec()
          .get("/graphql")
          .withGraphQLQuery(
            `query GetPosition {
                getPosition {
                  message
              }
          }`
          )
          .withHeaders("Authorization", "$S{flipperToken}")
          .expectStatus(200)
          .expectJson({
            data: {
              getPosition: {
                message: "position",
              },
            },
          });
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: config.get("RAY_EMAIL"),
            password: config.get("RAY_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          })
          .expectStatus(201)
          .expectBodyContains("AccessToken")
          .stores("rayToken", "AccessToken");

        await spec()
          .get("/graphql")
          .withHeaders("Authorization", "$S{rayToken}")
          .withGraphQLQuery(
            `query GetPosition {
              getPosition {
                message
            }
          }`
          )
          .expectStatus(200)
          .expectJson({
            data: {
              getPosition: {
                message: "position",
              },
            },
          });
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: config.get("BLUE_EMAIL"),
            password: config.get("BLUE_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          })
          .expectStatus(201)
          .expectBodyContains("AccessToken")
          .stores("blueToken", "AccessToken");
        await spec()
          .get("/graphql")
          .withGraphQLQuery(
            `query GetPosition {
              getPosition {
                message
            }
          }`
          )
          .withHeaders("Authorization", "$S{blueToken}")
          .expectStatus(200)
          .expectJsonMatch({
            errors: [{ message: "Forbidden resource" }],
          });
      });
    });
  });

  describe("manta: authorization", () => {
    it("should be unsuccessfull because flipper is not in the manta group", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("AccessToken")
        .stores("flipperToken", "AccessToken");
      await spec()
        .get("/graphql")
        .withGraphQLQuery(
          `query GetRay {
            getRay {
              message
            }
          }`
        )
        .withHeaders("Authorization", "$S{flipperToken}")
        .expectStatus(200)
        .expectJsonMatch({
          errors: [{ message: "Forbidden resource" }],
        });
    });
    it("should be successfull because ray is in the manta group", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("RAY_EMAIL"),
          password: config.get("RAY_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("AccessToken")
        .stores("rayToken", "AccessToken");
      await spec()
        .get("/graphql")
        .withGraphQLQuery(
          `query GetRay {
            getRay {
              message
            }
          }`
        )
        .withHeaders("Authorization", "$S{rayToken}")
        .expectStatus(200)
        .expectJson({
          data: {
            getRay: {
              message: "Ray",
            },
          },
        });
    });
  });
});
