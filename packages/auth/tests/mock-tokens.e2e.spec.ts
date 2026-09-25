import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CognitoMockService } from "../../testing/lib/cognito-mock.service";
import { CognitoTestingModule } from "../../testing/lib/cognito-testing.module";
import { Authentication, Authorization, CognitoAuthModule } from "../lib";

@Controller()
class TestController {
  @Get("orders")
  @Authorization({ requiredScopes: ["orders/read"] })
  orders() {
    return [];
  }

  @Get("me")
  @Authentication({ tokenUse: "id" })
  me() {
    return {};
  }
}

describe("CognitoTestingModule mock tokens with the auth guards", () => {
  let app: INestApplication;
  let mock: CognitoMockService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CognitoAuthModule.register({}),
        CognitoTestingModule.register(
          {},
          { enabled: true, user: { username: "john" } },
        ),
      ],
      controllers: [TestController],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useFactory({ factory: CognitoTestingModule.createJwtVerifierFactory })
      .compile();
    app = moduleRef.createNestApplication({ logger: false });
    await app.listen(0);
    mock = moduleRef.get(CognitoMockService);
  });

  afterAll(() => app.close());

  async function status(path: string, token: string) {
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    const res = await fetch(url + path, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.status;
  }

  it("authorizes a client credentials token by scope", async () => {
    const token = mock.createClientCredentialsToken("m2m", ["orders/read"]);

    expect(await status("/orders", token)).toBe(200);
  });

  it("accepts an ID token and rejects the access token on an ID-only route", async () => {
    const { IdToken, AccessToken } = mock.getMockTokens("client");

    expect(await status("/me", IdToken!)).toBe(200);
    expect(await status("/me", AccessToken!)).toBe(401);
  });

  it("rejects expired tokens", async () => {
    mock.setMockConfig({
      enabled: true,
      user: { username: "john" },
      expiresIn: -60,
    });

    expect(await status("/me", mock.getMockTokens("client").IdToken!)).toBe(
      401,
    );
  });
});
