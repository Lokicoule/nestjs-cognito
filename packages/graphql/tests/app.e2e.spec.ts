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
        .get("/graphql")
        .withGraphQLQuery(
          `query GetMe {
          getMe {
            username,
            email,
            groups,
          }
        }`
        )
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({
          data: {
            getMe: {
              username: "8dd0d4e0-6175-40e4-a1d2-71b8c77c7121",
              email: "flipper@dolphin.com",
              groups: ["dolphin"],
            },
          },
        });
    });

    it("should be unsuccessfull because authorization header is missing", async () => {
      await spec()
        .get("/graphql")
        .withGraphQLQuery(
          `query GetMe {
        getMe {
          username,
          email,
          groups,
        }
      }`
        )
        .expectStatus(200)
        .expectJsonLike({
          errors: [],
        });
    });

    it("should be unsuccessfull because authorization header is wrong/has expired", async () => {
      await spec()
        .get("/graphql")
        .withGraphQLQuery(
          `query GetMe {
      getMe {
        username,
        email,
        groups,
      }
    }`
        )
        .withHeaders("Authorization", "Bearer wrong-token")
        .expectStatus(200)
        .expectJsonLike({
          errors: [],
        });
      await spec()
        .get("/graphql")
        .withGraphQLQuery(
          `query GetMe {
    getMe {
      username,
      email,
      groups,
    }
  }`
        )
        .withHeaders(
          "Authorization",
          "Bearer eyJraWQiOiJKUnVCOVR1bEx4NU9MUU43SDZRUThVMGhmSG1UT284Q1h1RFR2NGc5aVRJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmODhkOGIzNi0yZmRiLTQ3ZDgtYTU4OS0yODQ2YmQwMzc1MjYiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9PTTIycTh6bjAiLCJjbGllbnRfaWQiOiI0ZTBxMG1tZmNiajJwNWZzdDZ1MHRva2RwMiIsIm9yaWdpbl9qdGkiOiJiM2Y1ZGQ3ZS00ZTcyLTRmMzAtYTUzYi1lNzNmYTllZTI0MzgiLCJldmVudF9pZCI6ImU5OTI2ZTVhLTc3OGQtNDg2MC05Nzc3LWJmOTU1NWVlZjkwMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NTg2NzI0NzksImV4cCI6MTY1ODY3NjA3OSwiaWF0IjoxNjU4NjcyNDc5LCJqdGkiOiI2NDZiYTA4ZC1jMGE3LTQ3YjAtYmM4Mi1mYTY0N2FlMjgyYzUiLCJ1c2VybmFtZSI6ImY4OGQ4YjM2LTJmZGItNDdkOC1hNTg5LTI4NDZiZDAzNzUyNiJ9.Z8OkqNgc-zYdDt5fPoDB88VHnUOhGxlLLpdFi8kuGQ_LmEKWBrOZvdgWHq_-6TdQysdxcZkPGMZnZesMVGu4VXSbUbmUkMGrTTXT5suJRHXhvhIB75j35mh132avMuTSPzC1vxbPLJKyN7zQ9_OLodQATiVMvtRWME8geynPokHxADTFkFppK_oYfLoqIFMS8maLsU2UUy84S11xqzV1Sz0jTmyd2D4s2JOYxXflC-q4855WZDGGlUmdviNgLOW5S0D1C_ClCg--M-G9RLgh80Pyofd2ScSpuaHfIOyNhs2tPpJM3bNBuubiZLijDQMcQ7wRMw5DOwMN1Zix5Niw1g"
        )
        .expectStatus(200)
        .expectJsonLike({
          errors: [],
        });
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
