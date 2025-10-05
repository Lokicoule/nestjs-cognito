/**
 * Exception thrown when a Cognito token type doesn't match the expected type
 */
export class CognitoTokenTypeMismatchError extends Error {
  constructor(expectedType: string, actualType: string) {
    super(`Expected ${expectedType} token but received ${actualType} token`);
    this.name = 'CognitoTokenTypeMismatchError';
  }
}
