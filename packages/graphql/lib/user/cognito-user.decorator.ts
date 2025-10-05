import { createCognitoUserDecorator } from "@nestjs-cognito/auth";
import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/**
 * Generic GraphQL decorator that can be used to inject the cognito user into a resolver.
 * This decorator is agnostic to token type and works with both access and ID tokens.
 * 
 * @param {string | string[]} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @GqlCognitoUser() user: CognitoJwtPayload
 * @example @GqlCognitoUser("username") username: string
 * @example @GqlCognitoUser(["cognito:username", "email"]) { username, email }: { username: string, email: string }
 */
export const GqlCognitoUser = createCognitoUserDecorator(
  undefined,
  (ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req
);

/**
 * Specialized GraphQL decorator for Access Token payloads.
 * This decorator is specifically designed for access tokens and provides better type safety.
 * 
 * @param {string | string[]} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @GqlCognitoAccessUser() user: CognitoAccessTokenPayload
 * @example @GqlCognitoAccessUser("username") username: string
 * @example @GqlCognitoAccessUser(["username", "scope"]) { username, scope }: { username: string, scope: string }
 */
export const GqlCognitoAccessUser = createCognitoUserDecorator(
  'access',
  (ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req
);

/**
 * Specialized GraphQL decorator for ID Token payloads.
 * This decorator is specifically designed for ID tokens and provides better type safety.
 * 
 * @param {string | string[]} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @GqlCognitoIdUser() user: CognitoIdTokenPayload
 * @example @GqlCognitoIdUser("cognito:username") username: string
 * @example @GqlCognitoIdUser(["cognito:username", "email"]) { username, email }: { username: string, email: string }
 */
export const GqlCognitoIdUser = createCognitoUserDecorator(
  'id',
  (ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req
);
