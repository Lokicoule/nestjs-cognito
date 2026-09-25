import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { Controller, Get, INestApplication, Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Authentication } from "./authentication";
import { CognitoAuthModule } from "./cognito-auth.module";
import { CognitoAccessUser } from "./user";

@Controller("access")
@Authentication()
class AccessController {
  @Get()
  get(@CognitoAccessUser("sub") sub: string) {
    return { sub };
  }
}

async function createApp(verifier: unknown): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [CognitoAuthModule.register({})],
    controllers: [AccessController],
  })
    .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
    .useValue(verifier)
    .compile();
  const app = moduleRef.createNestApplication({ logger: false });
  await app.listen(0);
  return app;
}

async function request(app: INestApplication, path: string, token?: string) {
  const url = (await app.getUrl()).replace("[::1]", "localhost");
  const res = await fetch(url + path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return { status: res.status, body: await res.json() };
}

describe("CognitoAuthModule", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp({
      verify: async () => ({
        sub: "user-id",
        token_use: "id",
        "cognito:username": "flipper",
      }),
    });
  });

  afterAll(() => app.close());

  it("answers a token type mismatch with 401", async () => {
    const res = await request(app, "/access", "token");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(
      "Expected access token but received id token",
    );
  });

  it("refuses to start without a JWT verifier", async () => {
    await expect(createApp(null)).rejects.toThrow("No JWT verifier configured");
  });

  it("preloads the JWKS at startup", async () => {
    const hydrate = jest.fn().mockResolvedValue(undefined);
    const preloaded = await createApp({ verify: jest.fn(), hydrate });

    expect(hydrate).toHaveBeenCalledTimes(1);
    await preloaded.close();
  });

  it("starts with a warning when the JWKS cannot be preloaded", async () => {
    const warn = jest.spyOn(Logger.prototype, "warn").mockImplementation();
    const hydrate = jest.fn().mockRejectedValue(new Error("network down"));
    const started = await createApp({ verify: jest.fn(), hydrate });

    expect(warn).toHaveBeenCalledWith(
      "Could not preload the JWKS: network down",
    );
    warn.mockRestore();
    await started.close();
  });
});
