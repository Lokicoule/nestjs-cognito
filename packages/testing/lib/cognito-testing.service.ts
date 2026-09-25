import {
  AuthenticationResultType,
  CognitoIdentityProvider,
  InitiateAuthRequest,
  RespondToAuthChallengeCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { InjectCognitoIdentityProvider } from "@nestjs-cognito/core";
import {
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  UnauthorizedException,
} from "@nestjs/common";
import { createHmac } from "node:crypto";
import { CognitoMockService } from "./cognito-mock.service";
import { COGNITO_TESTING_OPTIONS } from "./cognito-testing.constants";
import type { CognitoTestingOptions, MockConfig } from "./types";

@Injectable()
export class CognitoTestingService {
  #mockConfig: MockConfig = {};

  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    private readonly cognitoMockService: CognitoMockService,
    @Optional()
    @Inject(COGNITO_TESTING_OPTIONS)
    private readonly options: CognitoTestingOptions = {},
  ) {}

  setMockConfig(config: MockConfig) {
    this.#mockConfig = config;
    this.cognitoMockService.setMockConfig(config);
  }

  verifyToken(token: string) {
    return this.cognitoMockService.verifyToken(token);
  }

  /**
   * Get the access token for the given username and password.
   * @param {InitiateAuthRequest} request
   * @returns {Promise<AuthenticationResultType>}
   */
  async getAccessToken(
    { username, password }: Record<string, string>,
    clientId: string,
    retry = true,
  ): Promise<AuthenticationResultType | undefined> {
    if (this.#mockConfig.enabled) {
      if (!this.#mockConfig.user) {
        throw new BadRequestException(
          "Mock configuration error: No mock user configured. Please set up a mock user before making requests.",
        );
      }
      return this.cognitoMockService.getMockTokens(clientId);
    }

    const request: InitiateAuthRequest = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        ...(await this.#secretHash(username, clientId)),
      },
    };

    try {
      const response = await this.client.initiateAuth(request);
      if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        await this.completeChallenge({
          username,
          password,
          session: response.Session || "",
          clientId,
        });
        if (retry) {
          return this.getAccessToken({ username, password }, clientId, false);
        }
      }
      return response.AuthenticationResult;
    } catch (error) {
      this.#handleAuthError(error);
    }
  }

  /**
   * Complete the challenge with the given password.
   * @param {string} username
   * @param {string} password
   * @param {string} session
   * @returns {Promise<AuthenticationResultType>}
   */
  async completeChallenge({
    username,
    password,
    session,
    clientId,
  }: Record<string, string>) {
    const request: RespondToAuthChallengeCommandInput = {
      ClientId: clientId,
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: password,
        ...(await this.#secretHash(username, clientId)),
      },
      Session: session,
    };

    try {
      return await this.client.respondToAuthChallenge(request);
    } catch (error) {
      this.#handleChallengeError(error);
    }
  }

  #handleAuthError(error: unknown): never {
    switch ((error as Error).name) {
      case "NotAuthorizedException":
      case "UserNotFoundException":
        throw new UnauthorizedException(
          "Authentication failed: Invalid username or password.",
          { cause: error },
        );
      case "UserNotConfirmedException":
        throw new UnauthorizedException(
          "Authentication incomplete: Please verify your email address to activate your account.",
          { cause: error },
        );
      case "InvalidParameterException":
        throw new BadRequestException(
          "Invalid request parameters. Please check your input.",
          { cause: error },
        );
      default:
        throw new UnauthorizedException(
          "Authentication failed. Please try again or contact support.",
          { cause: error },
        );
    }
  }

  #handleChallengeError(error: unknown): never {
    switch ((error as Error).name) {
      case "NotAuthorizedException":
        throw new UnauthorizedException(
          "Authentication failed: Invalid credentials.",
          { cause: error },
        );
      case "ExpiredCodeException":
      case "CodeMismatchException":
        throw new UnauthorizedException(
          "Authentication session expired. Please log in again.",
          { cause: error },
        );
      default:
        throw new UnauthorizedException(
          "Authentication failed. Please try again or contact support.",
          { cause: error },
        );
    }
  }

  async #secretHash(username: string, clientId: string) {
    const { clientSecret } = this.options;
    const secret =
      typeof clientSecret === "function" ? await clientSecret() : clientSecret;

    return secret
      ? {
          SECRET_HASH: createHmac("sha256", secret)
            .update(username + clientId)
            .digest("base64"),
        }
      : {};
  }
}
