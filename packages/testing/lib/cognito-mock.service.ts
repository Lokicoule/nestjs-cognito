import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { Injectable } from "@nestjs/common";
import { sign, verify } from "jsonwebtoken";
import type { MockConfig, TokenPayload } from "./types";

@Injectable()
export class CognitoMockService {
  readonly #REGION = "eu-west-1";
  readonly #SECRET_KEY = "your-256-bit-secret-key-for-testing-purposes-only";
  readonly #TOKEN_EXPIRY = 3600;
  #mockConfig: MockConfig = {};

  setMockConfig(config: MockConfig) {
    this.#mockConfig = config;
  }

  getMockConfig(): MockConfig {
    return this.#mockConfig;
  }

  private createBasePayload(
    clientId: string
  ): Omit<TokenPayload, "token_use" | "scope"> {
    const mockUser = this.#mockConfig.user;
    if (!mockUser) {
      throw new Error("No mock user configured");
    }

    return {
      sub: mockUser.username,
      iss: `https://cognito-idp.${this.#REGION}.amazonaws.com/${this.#REGION}_test`,
      aud: clientId,
      exp: Math.floor(Date.now() / 1000) + this.#TOKEN_EXPIRY,
      iat: Math.floor(Date.now() / 1000),
      auth_time: Math.floor(Date.now() / 1000),
      "cognito:groups": mockUser.groups || [],
      "cognito:username": mockUser.username,
      email: mockUser.email,
      email_verified: true,
      ...mockUser.attributes,
    };
  }

  private createToken(payload: TokenPayload): string {
    return sign(payload, this.#SECRET_KEY, {
      algorithm: "HS256",
    });
  }

  getMockTokens(clientId: string): AuthenticationResultType {
    const basePayload = this.createBasePayload(clientId);

    const accessToken = this.createToken({
      ...basePayload,
      token_use: "access",
      scope: "aws.cognito.signin.user.admin",
    } as TokenPayload);

    const idToken = this.createToken({
      ...basePayload,
      token_use: "id",
    } as TokenPayload);

    const refreshToken = this.createToken({
      ...basePayload,
      token_use: "refresh",
    } as TokenPayload);

    return {
      AccessToken: accessToken,
      IdToken: idToken,
      RefreshToken: refreshToken,
      TokenType: "Bearer",
      ExpiresIn: this.#TOKEN_EXPIRY,
    };
  }

  verifyToken(token: string): TokenPayload {
    return verify(token, this.#SECRET_KEY) as TokenPayload;
  }
}
