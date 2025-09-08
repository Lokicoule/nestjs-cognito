import { Inject } from "@nestjs/common";
import {
  InjectCognitoIdentityProvider,
  InjectCognitoJwtVerifier,
  InjectCognitoJwtExtractor,
} from "./cognito.decorators";
import {
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
  COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
} from "../cognito.constants";

jest.mock("@nestjs/common", () => ({
  Inject: jest.fn(),
}));

describe("Cognito Decorators", () => {
  const mockInject = Inject as jest.MockedFunction<typeof Inject>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("InjectCognitoIdentityProvider", () => {
    it("should return Inject decorator with correct token", () => {
      const mockDecorator = jest.fn();
      mockInject.mockReturnValue(mockDecorator);

      const result = InjectCognitoIdentityProvider();

      expect(mockInject).toHaveBeenCalledWith(COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN);
      expect(result).toBe(mockDecorator);
    });
  });

  describe("InjectCognitoJwtVerifier", () => {
    it("should return Inject decorator with correct token", () => {
      const mockDecorator = jest.fn();
      mockInject.mockReturnValue(mockDecorator);

      const result = InjectCognitoJwtVerifier();

      expect(mockInject).toHaveBeenCalledWith(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN);
      expect(result).toBe(mockDecorator);
    });
  });

  describe("InjectCognitoJwtExtractor", () => {
    it("should return Inject decorator with correct token", () => {
      const mockDecorator = jest.fn();
      mockInject.mockReturnValue(mockDecorator);

      const result = InjectCognitoJwtExtractor();

      expect(mockInject).toHaveBeenCalledWith(COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN);
      expect(result).toBe(mockDecorator);
    });
  });
});