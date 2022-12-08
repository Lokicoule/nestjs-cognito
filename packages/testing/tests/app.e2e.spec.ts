import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { request, spec } from "pactum";
import { TestingAppModule } from "./app.module";

describe("Cognito Module : Testing", () => {
  let app: INestApplication;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TestingAppModule],
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

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  describe("login", () => {
    it("should be successful and return http code 2O1", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("COGNITO_USER_EMAIL"),
          password: config.get("COGNITO_USER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("AccessToken");
    });

    it("should be unsuccessful and return http code 403", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: "John Doe",
          password: "123456",
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(401);
    });
  });
});
