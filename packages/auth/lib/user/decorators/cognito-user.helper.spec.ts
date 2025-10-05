import type { CognitoJwtPayload } from "@nestjs-cognito/core";
import { CognitoTokenTypeMismatchError } from "../../errors/cognito-token-type-mismatch.error";
import { extractCognitoUserData } from "./cognito-user.helper";

describe("extractCognitoUserData", () => {
  const mockAccessTokenPayload: CognitoJwtPayload = {
    token_use: "access",
    username: "testuser",
    scope: "api/read",
  } as unknown as CognitoJwtPayload;

  const mockIdTokenPayload: CognitoJwtPayload = {
    token_use: "id",
    "cognito:username": "testuser",
    email: "test@example.com",
  } as unknown as CognitoJwtPayload;

  it("should return undefined when payload is undefined", () => {
    expect(extractCognitoUserData(undefined)).toBeUndefined();
  });

  it("should return the full payload when no data is specified", () => {
    const result = extractCognitoUserData(mockAccessTokenPayload);
    expect(result).toEqual(mockAccessTokenPayload);
  });

  describe("property extraction", () => {
    it("should extract a single property", () => {
      expect(extractCognitoUserData(mockAccessTokenPayload, undefined, "username")).toBe("testuser");
    });

    it("should extract property with cognito: prefix fallback", () => {
      expect(extractCognitoUserData(mockIdTokenPayload, undefined, "username")).toBe("testuser");
    });

    it("should extract multiple properties as an object", () => {
      const result = extractCognitoUserData(mockIdTokenPayload, undefined, ["username", "email"]);
      expect(result).toEqual({
        username: "testuser",
        email: "test@example.com",
      });
    });
  });

  describe("token type validation", () => {
    it.each([
      ["access", mockAccessTokenPayload],
      ["id", mockIdTokenPayload],
    ] as const)("should not throw when %s token type matches", (expectedType, payload) => {
      expect(() => extractCognitoUserData(payload, expectedType)).not.toThrow();
    });

    it("should throw CognitoTokenTypeMismatchError when token type doesn't match", () => {
      expect(() => extractCognitoUserData(mockAccessTokenPayload, "id"))
        .toThrow(new CognitoTokenTypeMismatchError("id", "access"));
    });
  });
});
