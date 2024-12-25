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

  describe("auth/me-from-payload", () => {
    it("should be successful and return the current user", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken")
        .stores("flipperUsername", "#username from identity token");
      await spec()
        .get("/auth/me-from-payload")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({
          username: "$S{flipperUsername}",
          email: config.get("FLIPPER_EMAIL"),
          groups: ["dolphin"],
        });
    });
  });

  describe("auth/email-from-payload", () => {
    it("should be successful and return the current user", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken");
      await spec()
        .get("/auth/email-from-payload")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody(config.get("FLIPPER_EMAIL"));
    });
  });

  describe("Public route access", () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("FLIPPER_EMAIL"),
          password: config.get("FLIPPER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201);

      authToken = loginResponse.body.IdToken;
    });

    it("should be available to everyone - unauthenticated", async () => {
      await spec()
        .get("/auth/iampublic")
        .expectStatus(200)
        .expectBody("public");
    });

    it("should be available to everyone - authenticated", async () => {
      await spec()
        .get("/auth/iampublic")
        .withHeaders("Authorization", `Bearer ${authToken}`)
        .expectStatus(200)
        .expectBody("public");
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
          .expectBodyContains("IdToken")
          .stores("flipperToken", "IdToken");
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
          .expectBodyContains("IdToken")
          .stores("flipperToken", "IdToken");
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
          .expectBodyContains("IdToken")
          .stores("flipperToken", "IdToken");
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
          .expectBodyContains("IdToken")
          .stores("rayToken", "IdToken");

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
          .expectBodyContains("IdToken")
          .stores("blueToken", "IdToken");
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
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken");
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
        .expectBodyContains("IdToken")
        .stores("rayToken", "IdToken");
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
