import { Test, TestingModule } from "@nestjs/testing";
import { CognitoMockService } from "./cognito-mock.service";
import { TokenPayload } from "./types";

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

    it("should include correct claims in access token", () => {
      const tokens = service.getMockTokens(clientId);
      const decodedToken = service.verifyToken(
        tokens.AccessToken!
      ) as TokenPayload;

      expect(decodedToken.token_use).toBe("access");
      expect(decodedToken.scope).toBe("aws.cognito.signin.user.admin");
      expect(decodedToken.sub).toBe(mockUser.username);
      expect(decodedToken.email).toBe(mockUser.email);
      expect(decodedToken["cognito:groups"]).toEqual(mockUser.groups);
      expect(decodedToken.custom_field).toBe(mockUser.attributes.custom_field);
    });

    it("should include correct claims in id token", () => {
      const tokens = service.getMockTokens(clientId);
      const decodedToken = service.verifyToken(tokens.IdToken!) as TokenPayload;

      expect(decodedToken.token_use).toBe("id");
      expect(decodedToken.sub).toBe(mockUser.username);
      expect(decodedToken.email).toBe(mockUser.email);
      expect(decodedToken["cognito:groups"]).toEqual(mockUser.groups);
    });

    it("should include correct claims in refresh token", () => {
      const tokens = service.getMockTokens(clientId);
      const decodedToken = service.verifyToken(
        tokens.RefreshToken!
      ) as TokenPayload;

      expect(decodedToken.token_use).toBe("refresh");
      expect(decodedToken.sub).toBe(mockUser.username);
    });

    it("should throw error when no mock user is configured", () => {
      service.setMockConfig({});
      expect(() => service.getMockTokens(clientId)).toThrow(
        "No mock user configured"
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
