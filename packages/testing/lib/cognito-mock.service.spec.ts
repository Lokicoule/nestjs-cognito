import { Test, TestingModule } from "@nestjs/testing";
import { CognitoMockService } from "./cognito-mock.service";

describe("CognitoMockService", () => {
  let service: CognitoMockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CognitoMockService],
    }).compile();

    service = module.get<CognitoMockService>(CognitoMockService);
  });

  const mockUser = {
    username: "testuser",
    email: "test@example.com",
    groups: ["users"],
    attributes: {
      custom_field: "custom_value",
    },
  };
  const clientId = "test-client-id";

  describe("configuration", () => {
    it("should set and get mock configuration", () => {
      const mockConfig = { user: mockUser, enabled: true };
      service.setMockConfig(mockConfig);
      expect(service.getMockConfig()).toEqual(mockConfig);
    });
  });

  describe("token generation", () => {
    beforeEach(() => {
      service.setMockConfig({ user: mockUser });
    });

    it("should generate valid tokens", () => {
      const tokens = service.getMockTokens(clientId);

      expect(tokens).toBeDefined();
      expect(tokens.AccessToken).toBeDefined();
      expect(tokens.IdToken).toBeDefined();
      expect(tokens.RefreshToken).toBeDefined();
      expect(tokens.TokenType).toBe("Bearer");
      expect(typeof tokens.ExpiresIn).toBe("number");
    });

    it("issues an access token shaped like Cognito's", () => {
      const token = service.verifyToken(
        service.getMockTokens(clientId).AccessToken!,
      );

      expect(token).toMatchObject({
        token_use: "access",
        sub: "testuser",
        username: "testuser",
        client_id: clientId,
        scope: "aws.cognito.signin.user.admin",
        "cognito:groups": ["users"],
      });
      expect(token).not.toHaveProperty("aud");
      expect(token).not.toHaveProperty("email");
      expect(token).not.toHaveProperty("custom_field");
    });

    it("issues an ID token with the user attributes", () => {
      const token = service.verifyToken(
        service.getMockTokens(clientId).IdToken!,
      );

      expect(token).toMatchObject({
        token_use: "id",
        sub: "testuser",
        aud: clientId,
        "cognito:username": "testuser",
        email: "test@example.com",
        "cognito:groups": ["users"],
        custom_field: "custom_value",
      });
    });

    it("issues an opaque refresh token", () => {
      const { RefreshToken } = service.getMockTokens(clientId);

      expect(() => service.verifyToken(RefreshToken!)).toThrow();
    });

    it("uses the configured sub and scopes", () => {
      service.setMockConfig({
        user: { ...mockUser, sub: "user-id", scopes: ["orders/read"] },
      });
      const token = service.verifyToken(
        service.getMockTokens(clientId).AccessToken!,
      );

      expect(token).toMatchObject({ sub: "user-id", scope: "orders/read" });
    });

    it("issues expired tokens when expiresIn is negative", () => {
      service.setMockConfig({ user: mockUser, expiresIn: -60 });
      const { IdToken } = service.getMockTokens(clientId);

      expect(() => service.verifyToken(IdToken!)).toThrow("jwt expired");
    });

    it("issues client credentials tokens", () => {
      const token = service.verifyToken(
        service.createClientCredentialsToken("m2m-client", [
          "orders/read",
          "orders/write",
        ]),
      );

      expect(token).toMatchObject({
        token_use: "access",
        sub: "m2m-client",
        client_id: "m2m-client",
        scope: "orders/read orders/write",
      });
      expect(token).not.toHaveProperty("username");
    });

    it("should throw error when no mock user is configured", () => {
      service.setMockConfig({});
      expect(() => service.getMockTokens(clientId)).toThrow(
        "No mock user configured",
      );
    });
  });

  describe("token verification", () => {
    it("should verify valid tokens", () => {
      service.setMockConfig({ user: mockUser });
      const tokens = service.getMockTokens(clientId);
      expect(() => service.verifyToken(tokens.AccessToken!)).not.toThrow();
    });

    it("should throw on invalid tokens", () => {
      expect(() => service.verifyToken("invalid-token")).toThrow();
    });
  });
});
