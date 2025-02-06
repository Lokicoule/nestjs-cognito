import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { handler, request, spec } from "pactum";
import * as express from "express";
import { AppModule } from "./app.module";

describe("Cognito Module : GraphQL", () => {
  let app: INestApplication;
  let config: ConfigService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    config = moduleFixture.get<ConfigService>(ConfigService);
    jwt = moduleFixture.get<JwtService>(JwtService);

    app.use(express.json());
    await app.listen(0);
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    request.setBaseUrl(url);

    handler.addCaptureHandler("username from identity token", (ctx) => {
      return jwt.decode((ctx.res.json as any).IdToken)!["cognito:username"];
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe("getMeFromPayload", () => {
    it("should be successful and return the current user", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .withHeaders("Content-Type", "application/json")
        .expectStatus(201)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken")
        .stores("flipperUsername", "#username from identity token");
      await spec()
        .get("/graphql")
        .withGraphQLQuery(
          `query GetMeFromPayload {
          getMeFromPayload {
            username,
            email,
            groups,
          }
        }`
        )
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .withHeaders("Content-Type", "application/json")
        .expectStatus(200)
        .expectBody({
          data: {
            getMeFromPayload: {
              username: "$S{flipperUsername}",
              email: config.get("FLIPPER_EMAIL"),
              groups: ["dolphin"],
            },
          },
        });
    });
  });

  describe("getEmailFromPayload", () => {
    it("should be successful and return the current user", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .withHeaders("Content-Type", "application/json")
        .expectStatus(201)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken");
      await spec()
        .get("/graphql")
        .withGraphQLQuery(`query GetEmailFromPayload { getEmailFromPayload }`)
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .withHeaders("Content-Type", "application/json")
        .expectStatus(200)
        .expectBody({
          data: {
            getEmailFromPayload: config.get("FLIPPER_EMAIL"),
          },
        });
    });
  });

  describe("dolphin: authorization", () => {
    describe("flipper", () => {
      it("should be unsuccessful because ray is not in the dolphin group", async () => {
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: config.get("RAY_EMAIL"),
            password: config.get("RAY_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          })
          .withHeaders("Content-Type", "application/json")
          .expectStatus(201)
          .expectBodyContains("IdToken")
          .stores("flipperToken", "IdToken");
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
          .withHeaders("Content-Type", "application/json")
          .expectStatus(200)
          .expectJsonLike({
            errors: [],
          });
      });
      it("should be successful because user is in the dolphin group", async () => {
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: config.get("FLIPPER_EMAIL"),
            password: config.get("FLIPPER_PASSWORD"),
            clientId: config.get("COGNITO_CLIENT_ID"),
          })
          .withHeaders("Content-Type", "application/json")
          .expectStatus(201)
          .expectBodyContains("IdToken")
          .stores("flipperToken", "IdToken");
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
          .withHeaders("Content-Type", "application/json")
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
          .withHeaders("Content-Type", "application/json")
          .expectStatus(201)
          .expectBodyContains("IdToken")
          .stores("flipperToken", "IdToken");
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
          .withHeaders("Content-Type", "application/json")
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
          .withHeaders("Content-Type", "application/json")
          .expectStatus(201)
          .expectBodyContains("IdToken")
          .stores("rayToken", "IdToken");

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
          .withHeaders("Content-Type", "application/json")
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
          .withHeaders("Content-Type", "application/json")
          .expectStatus(201)
          .expectBodyContains("IdToken")
          .stores("blueToken", "IdToken");
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
          .withHeaders("Content-Type", "application/json")
          .expectStatus(200)
          .expectJsonMatch({
            errors: [{ message: "Forbidden resource" }],
          });
      });
    });
  });

  describe("manta: authorization", () => {
    it("should be unsuccessful because flipper is not in the manta group", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .withHeaders("Content-Type", "application/json")
        .expectStatus(201)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken");
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
        .withHeaders("Content-Type", "application/json")
        .expectStatus(200)
        .expectJsonMatch({
          errors: [{ message: "Forbidden resource" }],
        });
    });
    it("should be successful because ray is in the manta group", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("RAY_EMAIL"),
          password: config.get("RAY_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .withHeaders("Content-Type", "application/json")
        .expectStatus(201)
        .expectBodyContains("IdToken")
        .stores("rayToken", "IdToken");
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
        .withHeaders("Content-Type", "application/json")
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
