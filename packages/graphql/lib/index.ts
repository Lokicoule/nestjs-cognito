import {
  Authentication,
  AuthenticationGuard as CoreAuthenticationGuard,
  Authorization,
  AuthorizationGuard as CoreAuthorizationGuard,
  CognitoAccessUser,
  CognitoIdUser,
  CognitoUser,
} from "@nestjs-cognito/auth";
import { Injectable } from "@nestjs/common";

// @nestjs-cognito/auth handles GraphQL resolvers since 4.0: these aliases
// keep existing imports working and will be removed in 5.0.

/** @deprecated Use `Authentication` from `@nestjs-cognito/auth`. */
export const GqlAuthentication = Authentication;

/** @deprecated Use `Authorization` from `@nestjs-cognito/auth`. */
export const GqlAuthorization = Authorization;

/** @deprecated Use `CognitoUser` from `@nestjs-cognito/auth`. */
export const GqlCognitoUser = CognitoUser;

/** @deprecated Use `CognitoAccessUser` from `@nestjs-cognito/auth`. */
export const GqlCognitoAccessUser = CognitoAccessUser;

/** @deprecated Use `CognitoIdUser` from `@nestjs-cognito/auth`. */
export const GqlCognitoIdUser = CognitoIdUser;

/** @deprecated Use `AuthenticationGuard` from `@nestjs-cognito/auth`. */
@Injectable()
export class AuthenticationGuard extends CoreAuthenticationGuard {}

/** @deprecated Use `AuthorizationGuard` from `@nestjs-cognito/auth`. */
export const AuthorizationGuard = CoreAuthorizationGuard;
