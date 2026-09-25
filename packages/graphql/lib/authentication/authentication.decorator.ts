import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "./authentication.guard";

/**
 * Decorator for the AuthenticationGuard
 * @returns {ClassDecorator} - The decorator
 */
export function GqlAuthentication(): ClassDecorator & MethodDecorator {
  return applyDecorators(UseGuards(AuthenticationGuard));
}
