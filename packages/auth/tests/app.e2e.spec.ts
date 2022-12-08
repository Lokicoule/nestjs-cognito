import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { handler, request, spec } from "pactum";
import { AppModule } from "./app.module";

describe("Cognito Module : Auth", () => {
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

  describe("auth/me", () => {
    it("should be successful and return the current user", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("AccessToken")
        .stores("flipperToken", "AccessToken")
        .stores("flipperUsername", "#username from identity token");
      await spec()
        .get("/auth/me")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({
          _username: "$S{flipperUsername}",
          _email: config.get("FLIPPER_EMAIL"),
          _groups: ["dolphin"],
        });
    });

    it("should be unsuccessful because authorization header is missing", async () => {
      await spec().get("/auth/me").expectStatus(401);
    });

    it("should be unsuccessful because authorization header is wrong/has expired", async () => {
      await spec()
        .get("/auth/me")
        .withHeaders("Authorization", "Bearer wrong-token")
        .expectStatus(401);
      await spec()
        .get("/auth/me")
        .withHeaders(
          "Authorization",
          "Bearer eyJraWQiOiJKUnVCOVR1bEx4NU9MUU43SDZRUThVMGhmSG1UT284Q1h1RFR2NGc5aVRJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmODhkOGIzNi0yZmRiLTQ3ZDgtYTU4OS0yODQ2YmQwMzc1MjYiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9PTTIycTh6bjAiLCJjbGllbnRfaWQiOiI0ZTBxMG1tZmNiajJwNWZzdDZ1MHRva2RwMiIsIm9yaWdpbl9qdGkiOiJiM2Y1ZGQ3ZS00ZTcyLTRmMzAtYTUzYi1lNzNmYTllZTI0MzgiLCJldmVudF9pZCI6ImU5OTI2ZTVhLTc3OGQtNDg2MC05Nzc3LWJmOTU1NWVlZjkwMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NTg2NzI0NzksImV4cCI6MTY1ODY3NjA3OSwiaWF0IjoxNjU4NjcyNDc5LCJqdGkiOiI2NDZiYTA4ZC1jMGE3LTQ3YjAtYmM4Mi1mYTY0N2FlMjgyYzUiLCJ1c2VybmFtZSI6ImY4OGQ4YjM2LTJmZGItNDdkOC1hNTg5LTI4NDZiZDAzNzUyNiJ9.Z8OkqNgc-zYdDt5fPoDB88VHnUOhGxlLLpdFi8kuGQ_LmEKWBrOZvdgWHq_-6TdQysdxcZkPGMZnZesMVGu4VXSbUbmUkMGrTTXT5suJRHXhvhIB75j35mh132avMuTSPzC1vxbPLJKyN7zQ9_OLodQATiVMvtRWME8geynPokHxADTFkFppK_oYfLoqIFMS8maLsU2UUy84S11xqzV1Sz0jTmyd2D4s2JOYxXflC-q4855WZDGGlUmdviNgLOW5S0D1C_ClCg--M-G9RLgh80Pyofd2ScSpuaHfIOyNhs2tPpJM3bNBuubiZLijDQMcQ7wRMw5DOwMN1Zix5Niw1g"
        )
        .expectStatus(401);
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
          .expectStatus(201)
          .expectBodyContains("AccessToken")
          .stores("flipperToken", "AccessToken");
        await spec()
          .get("/dolphin/flipper")
          .withHeaders("Authorization", "Bearer $S{flipperToken}")
          .expectStatus(403);
      });
      it("should be successful because user is in the dolphin group", async () => {
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
          .get("/dolphin/flipper")
          .withHeaders("Authorization", "Bearer $S{flipperToken}")
          .expectStatus(200)
          .expectBody({
            message: "Flipper",
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
          .get("/dolphin/position")
          .withHeaders("Authorization", "Bearer $S{flipperToken}")
          .expectStatus(200)
          .expectBody({ message: "position" });
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
          .get("/dolphin/position")
          .withHeaders("Authorization", "Bearer $S{rayToken}")
          .expectStatus(200)
          .expectBody({ message: "position" });
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
          .get("/dolphin/position")
          .withHeaders("Authorization", "Bearer $S{blueToken}")
          .expectStatus(403);
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
        .get("/manta/ray")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(403);
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
        .get("/manta/ray")
        .withHeaders("Authorization", "Bearer $S{rayToken}")
        .expectStatus(200)
        .expectBody({
          message: "Ray",
        });
    });
  });
});
