import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CognitoTestingController } from "./cognito-testing.controller";
import { CognitoTestingModule } from "./cognito-testing.module";
import { MockConfig } from "./types";

describe("CognitoTestingController", () => {
  let controller: CognitoTestingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CognitoTestingModule.register({
          identityProvider: {
            region: "us-east-1",
          },
        }),
      ],
    }).compile();

    controller = module.get<CognitoTestingController>(CognitoTestingController);
  });

  describe("login", () => {
    it("should return JWT tokens with 200 status for valid credentials when mocking is enabled", async () => {
      const mockConfig = {
        enabled: true,
        user: {
          username: "testuser",
          email: "test@example.com",
          groups: ["users"],
          attributes: {
            custom_field: "custom_value",
          },
        },
      };

      controller.setMockConfig(mockConfig);

      const result = await controller.login({
        username: "testuser",
        password: "password123",
        clientId: "test-client-id",
      });

      expect(result).toBeDefined();
      expect(result!.AccessToken).toBeDefined();
      expect(result!.IdToken).toBeDefined();
      expect(result!.RefreshToken).toBeDefined();
      expect(result!.TokenType).toBe("Bearer");
      expect(result!.ExpiresIn).toBe(3600);
    });

    it("should throw BadRequestException when mocking is enabled but no user is configured", async () => {
      await expect(
        controller.login({
          userPoolId: "test-user-pool-id",
          clientId: "test-client-id",
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should generate tokens with correct claims for configured user", async () => {
      const mockConfig = {
        enabled: true,
        user: {
          username: "testuser",
          email: "test@example.com",
          groups: ["admin", "users"],
          attributes: {
            custom_field: "custom_value",
          },
        },
      } satisfies MockConfig;

      controller.setMockConfig(mockConfig);

      const result = await controller.login({
        username: "testuser",
        password: "password123",
        clientId: "test-client-id",
      });

      const decode = (token: string) =>
        JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

      expect(decode(result!.IdToken!)).toMatchObject({
        sub: "testuser",
        token_use: "id",
        email: "test@example.com",
        "cognito:groups": ["admin", "users"],
        custom_field: "custom_value",
      });
      expect(decode(result!.AccessToken!)).toMatchObject({
        sub: "testuser",
        token_use: "access",
        client_id: "test-client-id",
      });
    });
  });

  describe("setMockConfig", () => {
    it("should successfully set mock configuration with 200 status", async () => {
      const mockConfig = {
        enabled: true,
        user: {
          username: "testuser",
        },
      };

      const result = controller.setMockConfig(mockConfig);
      expect(result).toEqual({ success: true });
    });
  });
});
