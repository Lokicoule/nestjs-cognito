import {
  AuthenticationResultType,
  CognitoIdentityProvider,
  InitiateAuthRequest,
  RespondToAuthChallengeCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectCognitoIdentityProvider } from "@nestjs-cognito/core";

@Injectable()
export class CognitoTestingService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider
  ) {}

  /**
   * Get the access token for the given username and password.
   * @param {InitiateAuthRequest} request
   * @returns {Promise<AuthenticationResultType>}
   */
  public async getAccessToken(
    { username, password }: Record<string, string>,
    clientId: string,
    retry = true
  ): Promise<AuthenticationResultType | undefined> {
    const request: InitiateAuthRequest = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    try {
      const response = await this.client.initiateAuth(request);
      if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
        this.completeChallenge({
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
      throw new UnauthorizedException(error, "Invalid username or password.");
    }
  }

  /**
   * Complete the challenge with the given password.
   * @param {string} username
   * @param {string} password
   * @param {string} session
   * @returns {Promise<AuthenticationResultType>}
   */
  public async completeChallenge({
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
      },
      Session: session,
    };
    try {
      return await this.client.respondToAuthChallenge(request);
    } catch (error) {
      throw new UnauthorizedException(error, "Invalid username or password.");
    }
  }
}
