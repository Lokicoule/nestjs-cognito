import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "./authorization.guard";
import { AuthorizationOptions } from "@nestjs-cognito/auth";

/**
 * @deprecated This decorator is deprecated. Use GqlAuthorization instead. This decorator will be removed in the next major release.
 * Decorator for the AuthorizationGuard
 * @returns {ClassDecorator} - The decorator
 * @param {AuthorizationOptions} options - The options
 */
export function Authorization(options: AuthorizationOptions): ClassDecorator {
  return applyDecorators(UseGuards(AuthorizationGuard(options)));
}

/**
 * Decorator for the AuthorizationGuard
 * @returns {ClassDecorator} - The decorator
 * @param {AuthorizationOptions} options - The options
 */
export function GqlAuthorization(
  options: AuthorizationOptions
): ClassDecorator {
  return applyDecorators(UseGuards(AuthorizationGuard(options)));
}
