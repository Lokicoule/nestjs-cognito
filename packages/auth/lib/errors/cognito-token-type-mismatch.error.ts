import { UnauthorizedException } from "@nestjs/common";

/**
 * Exception thrown when a Cognito token type doesn't match the expected type
 */
export class CognitoTokenTypeMismatchError extends UnauthorizedException {
  constructor(expectedType: string, actualType: string) {
    super(`Expected ${expectedType} token but received ${actualType} token`);
    this.name = "CognitoTokenTypeMismatchError";
  }
}
