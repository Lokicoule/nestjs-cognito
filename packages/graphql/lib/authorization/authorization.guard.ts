import { CanActivate, Type } from "@nestjs/common";
import {
  AuthorizationOptions,
  createAuthorizationGuard,
  memoize,
} from "@nestjs-cognito/auth";
import { AuthenticationGuard } from "../authentication/authentication.guard";

export const AuthorizationGuard: (
  options: AuthorizationOptions
) => Type<CanActivate> = memoize((options: AuthorizationOptions) =>
  createAuthorizationGuard(options)(AuthenticationGuard)
);
