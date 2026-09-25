import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Authorization, CognitoAuthModule } from "../lib";

@Controller("orders")
@Authorization({ requiredScopes: ["orders/read", "orders/write"] })
class OrdersController {
  @Get()
  list() {
    return [];
  }
}

@Controller("invoices")
@Authorization({ allowedScopes: ["invoices/read", "invoices/admin"] })
class InvoicesController {
  @Get()
  list() {
    return [];
  }
}

describe("scopes", () => {
  let app: INestApplication;
  let scope: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CognitoAuthModule.register({})],
      controllers: [OrdersController, InvoicesController],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useValue({
        verify: async () => ({
          sub: "client-id",
          client_id: "client-id",
          token_use: "access",
          scope,
        }),
      })
      .compile();
    app = moduleRef.createNestApplication({ logger: false });
    await app.listen(0);
  });

  afterAll(() => app.close());

  async function status(tokenScope: string, path = "/orders") {
    scope = tokenScope;
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    const res = await fetch(url + path, {
      headers: { Authorization: "Bearer token" },
    });
    return res.status;
  }

  it("allows a token with every required scope", async () => {
    expect(await status("orders/read orders/write admin")).toBe(200);
  });

  it("forbids a token missing a required scope", async () => {
    expect(await status("orders/read")).toBe(403);
  });

  it("compares scopes case-sensitively", async () => {
    expect(await status("Orders/Read orders/write")).toBe(403);
  });

  it("allows a token with one of the allowed scopes", async () => {
    expect(await status("invoices/admin", "/invoices")).toBe(200);
  });

  it("forbids a token with none of the allowed scopes", async () => {
    expect(await status("orders/read", "/invoices")).toBe(403);
  });
});
