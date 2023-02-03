import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "./authentication.guard";

/**
 * @deprecated This decorator is deprecated. Use GqlAuthentication instead. This decorator will be removed in the next major release.
 * Decorator for the AuthenticationGuard
 * @returns {ClassDecorator} - The decorator
 */
export function Authentication(): ClassDecorator {
  return applyDecorators(UseGuards(AuthenticationGuard));
}

/**
 * Decorator for the AuthenticationGuard
 * @returns {ClassDecorator} - The decorator
 */
export function GqlAuthentication(): ClassDecorator {
  return applyDecorators(UseGuards(AuthenticationGuard));
}
