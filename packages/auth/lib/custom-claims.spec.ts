import type {
  CognitoAccessTokenPayload,
  CognitoIdTokenPayload,
  CognitoJwtPayload,
} from "@nestjs-cognito/core";

declare module "@nestjs-cognito/core" {
  interface CognitoCustomClaims {
    "custom:tenant"?: string;
  }
}

const tenantOf = (
  payload:
    CognitoJwtPayload | CognitoIdTokenPayload | CognitoAccessTokenPayload,
): string | undefined => payload["custom:tenant"];

describe("CognitoCustomClaims", () => {
  it("types the custom claims declared by the application", () => {
    const payload = { "custom:tenant": "acme" } as CognitoIdTokenPayload;

    expect(tenantOf(payload)).toBe("acme");
  });
});
