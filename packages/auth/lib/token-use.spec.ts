import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Authentication } from "./authentication";
import { Authorization } from "./authorization";
import { CognitoAuthModule } from "./cognito-auth.module";

@Controller("api")
@Authentication({ tokenUse: "access" })
class ApiController {
  @Get("access")
  access() {
    return {};
  }

  @Get("id")
  @Authentication({ tokenUse: "id" })
  id() {
    return {};
  }
}

@Controller("admin")
@Authorization({ requiredGroups: ["admin"], tokenUse: "id" })
class AdminController {
  @Get()
  get() {
    return {};
  }
}

describe("tokenUse", () => {
  let app: INestApplication;
  let tokenUse: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CognitoAuthModule.register({})],
      controllers: [ApiController, AdminController],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useValue({
        verify: async () => ({
          sub: "user-id",
          username: "john",
          token_use: tokenUse,
          "cognito:groups": ["admin"],
        }),
      })
      .compile();
    app = moduleRef.createNestApplication({ logger: false });
    await app.listen(0);
  });

  afterAll(() => app.close());

  async function get(path: string, use: string) {
    tokenUse = use;
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    const res = await fetch(url + path, {
      headers: { Authorization: "Bearer token" },
    });
    return { status: res.status, body: await res.json() };
  }

  it("accepts the expected token type", async () => {
    expect((await get("/api/access", "access")).status).toBe(200);
  });

  it("rejects another token type with 401", async () => {
    const res = await get("/api/access", "id");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(
      "Expected access token but received id token",
    );
  });

  it("lets a handler override the controller", async () => {
    expect((await get("/api/id", "id")).status).toBe(200);
    expect((await get("/api/id", "access")).status).toBe(401);
  });

  it("applies to @Authorization", async () => {
    expect((await get("/admin", "id")).status).toBe(200);
    expect((await get("/admin", "access")).status).toBe(401);
  });
});
