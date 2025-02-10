import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { handler, request, spec } from "pactum";
import { CognitoTestingModule } from "../../testing/lib/cognito-testing.module";
import { AppModule } from "./app.module";

describe("Cognito Module : Auth (Mocked)", () => {
  let app: INestApplication;
  let jwt: JwtService;

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
          }
        ),
        AppModule,
      ],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useFactory({
        factory: CognitoTestingModule.createJwtVerifierFactory
      })
      .compile();

    app = moduleFixture.createNestApplication();
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
          username: "flipper@example.com",
          password: "password",
          clientId: "test-client",
        })
        .expectStatus(200)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken")
        .stores("flipperUsername", "#username from identity token");

      await spec()
        .get("/auth/me-from-payload")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody({
          email: "flipper@example.com",
          groups: ["dolphin"],
          username: "flipper",
        });
    });
  });

  describe("auth/email-from-payload", () => {
    it("should be successful and return the current user", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: "flipper@example.com",
          password: "password",
          clientId: "test-client",
        })
        .expectStatus(200)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken");

      await spec()
        .get("/auth/email-from-payload")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(200)
        .expectBody("flipper@example.com");
    });
  });

  describe("Public route access", () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: "flipper@example.com",
          password: "password",
          clientId: "test-client",
        })
        .expectStatus(200);

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
    beforeEach(async () => {
      await spec()
        .post("/config")
        .withBody({
          enabled: true,
          user: {
            username: "ray",
            email: "ray@example.com",
            groups: ["manta"],
          },
        })
        .expectStatus(200);
    });

    describe("flipper", () => {
      it("should be unsuccessful because ray is not in the dolphin group", async () => {
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: "ray@example.com",
            password: "password",
            clientId: "test-client",
          })
          .expectStatus(200)
          .expectBodyContains("IdToken")
          .stores("rayToken", "IdToken");
        await spec()
          .get("/dolphin/flipper")
          .withHeaders("Authorization", "Bearer $S{rayToken}")
          .expectStatus(403);
      });
    });

    describe("position", () => {
      it("should be available to authenticated users, except for shark's members", async () => {
        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: "flipper@example.com",
            password: "password",
            clientId: "test-client",
          })
          .expectStatus(200)
          .expectBodyContains("IdToken")
          .stores("flipperToken", "IdToken");

        await spec()
          .get("/dolphin/position")
          .withHeaders("Authorization", "Bearer $S{flipperToken}")
          .expectStatus(200)
          .expectBody({ message: "position" });

        await spec()
          .post("/config")
          .withBody({
            enabled: true,
            user: {
              username: "ray",
              email: "ray@example.com",
              groups: ["manta"],
            },
          })
          .expectStatus(200);

        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: "ray@example.com",
            password: "password",
            clientId: "test-client",
          })
          .expectStatus(200)
          .expectBodyContains("IdToken")
          .stores("rayToken", "IdToken");

        await spec()
          .get("/dolphin/position")
          .withHeaders("Authorization", "Bearer $S{rayToken}")
          .expectStatus(200)
          .expectBody({ message: "position" });

        // Test with blue (shark group)
        await spec()
          .post("/config")
          .withBody({
            enabled: true,
            user: {
              username: "blue",
              email: "blue@example.com",
              groups: ["shark"],
            },
          })
          .expectStatus(200);

        await spec()
          .post("/cognito-testing-login")
          .withBody({
            username: "blue@example.com",
            password: "password",
            clientId: "test-client",
          })
          .expectStatus(200)
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
    it("should be unsuccessful because flipper is not in the manta group", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: "flipper@example.com",
          password: "password",
          clientId: "test-client",
        })
        .expectStatus(200)
        .expectBodyContains("IdToken")
        .stores("flipperToken", "IdToken");
      await spec()
        .get("/manta/ray")
        .withHeaders("Authorization", "Bearer $S{flipperToken}")
        .expectStatus(403);
    });

    it("should be successful because ray is in the manta group", async () => {
      await spec()
        .post("/config")
        .withBody({
          enabled: true,
          user: {
            username: "ray",
            email: "ray@example.com",
            groups: ["manta"],
          },
        })
        .expectStatus(200);

      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: "ray@example.com",
          password: "password",
          clientId: "test-client",
        })
        .expectStatus(200)
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
