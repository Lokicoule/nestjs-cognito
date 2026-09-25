import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { Injectable } from "@nestjs/common";
import { sign, verify } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import type { MockConfig, TokenPayload } from "./types";

@Injectable()
export class CognitoMockService {
  readonly #ISSUER =
    "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_test";
  readonly #SECRET_KEY = "your-256-bit-secret-key-for-testing-purposes-only";
  #mockConfig: MockConfig = {};

  setMockConfig(config: MockConfig) {
    this.#mockConfig = config;
  }

  getMockConfig(): MockConfig {
    return this.#mockConfig;
  }

  getMockTokens(clientId: string): AuthenticationResultType {
    const user = this.#mockConfig.user;
    if (!user) {
      throw new Error("No mock user configured");
    }

    const common = {
      sub: user.sub ?? user.username,
      "cognito:groups": user.groups ?? [],
      auth_time: Math.floor(Date.now() / 1000),
    };

    return {
      AccessToken: this.#sign({
        ...common,
        token_use: "access",
        client_id: clientId,
        username: user.username,
        scope: (user.scopes ?? ["aws.cognito.signin.user.admin"]).join(" "),
      }),
      IdToken: this.#sign({
        ...common,
        token_use: "id",
        aud: clientId,
        "cognito:username": user.username,
        email: user.email,
        email_verified: true,
        ...user.attributes,
      }),
      RefreshToken: randomUUID(),
      TokenType: "Bearer",
      ExpiresIn: this.#expiresIn,
    };
  }

  createClientCredentialsToken(clientId: string, scopes: string[]): string {
    return this.#sign({
      sub: clientId,
      token_use: "access",
      client_id: clientId,
      scope: scopes.join(" "),
    });
  }

  verifyToken(token: string): TokenPayload {
    return verify(token, this.#SECRET_KEY) as TokenPayload;
  }

  get #expiresIn() {
    return this.#mockConfig.expiresIn ?? 3600;
  }

  #sign(payload: object): string {
    return sign({ iss: this.#ISSUER, ...payload }, this.#SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: this.#expiresIn,
    });
  }
}
