import type { CognitoJwtPayload } from "@nestjs-cognito/core";
import { CognitoTokenTypeMismatchError } from "../../errors/cognito-token-type-mismatch.error";

/**
 * Extracts user data from a Cognito JWT payload
 * @param payload The JWT payload
 * @param expectedTokenType Optional token type to validate against
 * @param data The property name(s) to extract
 * @returns The extracted data or the full payload
 * @throws CognitoTokenTypeMismatchError if token type validation fails
 */
export function extractCognitoUserData(
  payload: CognitoJwtPayload | undefined,
  expectedTokenType?: 'access' | 'id',
  data?: string | string[]
): any {
  if (!Boolean(payload)) {
    return undefined;
  }

  if (expectedTokenType && payload.token_use !== expectedTokenType) {
    throw new CognitoTokenTypeMismatchError(expectedTokenType, payload.token_use);
  }

  if (!data) {
    return payload;
  }

  if (Array.isArray(data)) {
    return data.reduce((result, key) => {
      result[key] = payload[`cognito:${key}`] || payload[key];
      return result;
    }, {});
  }

  return payload[`cognito:${data}`] || payload[data];
}
