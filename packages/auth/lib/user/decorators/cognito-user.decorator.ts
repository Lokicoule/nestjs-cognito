import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY } from "../user.constants";
import { extractCognitoUserData } from "./cognito-user.helper";

/**
 * Core decorator logic shared by all Cognito user decorators
 */
export function createCognitoUserDecorator(
  validateTokenType?: 'access' | 'id',
  getRequest?: (ctx: ExecutionContext) => any
) {
  return createParamDecorator(
    (data: string | string[], ctx: ExecutionContext) => {
      const request = getRequest ? getRequest(ctx) : ctx.switchToHttp().getRequest();
      const payload = request[COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY];

      return extractCognitoUserData(payload, validateTokenType, data);
    },
  );
}

/**
 * Generic decorator that can be used to inject the cognito user into a controller.
 * This decorator is agnostic to token type and works with both access and ID tokens.
 * 
 * @param {string | string[]} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @CognitoUser() user: CognitoJwtPayload
 * @example @CognitoUser("username") username: string
 * @example @CognitoUser(["cognito:username", "email"]) { username, email }: { username: string, email: string }
 */
export const CognitoUser = createCognitoUserDecorator();

/**
 * Specialized decorator for Access Token payloads.
 * This decorator is specifically designed for access tokens and provides better type safety.
 * 
 * @param {string | string[]} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @CognitoAccessUser() user: CognitoAccessTokenPayload
 * @example @CognitoAccessUser("username") username: string
 * @example @CognitoAccessUser(["username", "scope"]) { username, scope }: { username: string, scope: string }
 */
export const CognitoAccessUser = createCognitoUserDecorator('access');

/**
 * Specialized decorator for ID Token payloads.
 * This decorator is specifically designed for ID tokens and provides better type safety.
 * 
 * @param {string | string[]} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @CognitoIdUser() user: CognitoIdTokenPayload
 * @example @CognitoIdUser("cognito:username") username: string
 * @example @CognitoIdUser(["cognito:username", "email"]) { username, email }: { username: string, email: string }
 */
export const CognitoIdUser = createCognitoUserDecorator('id');