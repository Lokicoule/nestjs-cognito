import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { request, spec } from "pactum";
import { AppModule } from "./app.module";

describe("Cognito Module: Register", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0);
    request.setBaseUrl((await app.getUrl()).replace("[::1]", "localhost"));
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  it("should return hello", async () => {
    await spec().get("/hello").expectStatus(200).expectBody({
      message: "Hello World!",
    });
  });
});
