// Replays the README usage through the package entry point.
import { Test } from "@nestjs/testing";
import {
  CognitoMockService,
  CognitoTestingModule,
  CognitoTestingService,
  type MockConfig,
  type TokenPayload,
} from "./index";

describe("@nestjs-cognito/testing public API", () => {
  const mockConfig: MockConfig = {
    enabled: true,
    user: {
      username: "john.doe",
      email: "john.doe@example.com",
      groups: ["users"],
    },
  };

  let testingService: CognitoTestingService;
  let mockService: CognitoMockService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CognitoTestingModule.register({}, mockConfig)],
    }).compile();

    testingService = moduleRef.get(CognitoTestingService);
    mockService = moduleRef.get(CognitoMockService);
  });

  it("returns the full authentication result from getAccessToken", async () => {
    const { AccessToken, IdToken, RefreshToken } =
      await testingService.getAccessToken(
        { username: "john.doe", password: "any" },
        "client-id",
      );

    expect(typeof AccessToken).toBe("string");
    expect(typeof IdToken).toBe("string");
    expect(typeof RefreshToken).toBe("string");
  });

  it("issues tokens that the mock service can verify", async () => {
    const { IdToken } = await testingService.getAccessToken(
      { username: "john.doe", password: "any" },
      "client-id",
    );

    const payload: TokenPayload = mockService.verifyToken(IdToken!);

    expect(payload["cognito:username"]).toBe("john.doe");
    expect(payload["cognito:groups"]).toEqual(["users"]);
  });

  it("switches the mocked user with setMockConfig", async () => {
    testingService.setMockConfig({
      enabled: true,
      user: { username: "admin", groups: ["admin"] },
    });

    const { IdToken } = await testingService.getAccessToken(
      { username: "admin", password: "any" },
      "client-id",
    );

    expect(mockService.verifyToken(IdToken!)["cognito:groups"]).toEqual([
      "admin",
    ]);
  });
});
