import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "./authorization.guard";
import { AuthorizationOptions } from "@nestjs-cognito/auth";

/**
 * Decorator for the AuthorizationGuard
 * @returns {ClassDecorator} - The decorator
 * @param {AuthorizationOptions} options - The options
 */
export function GqlAuthorization(
  options: AuthorizationOptions,
): ClassDecorator & MethodDecorator {
  return applyDecorators(UseGuards(AuthorizationGuard(options)));
}
