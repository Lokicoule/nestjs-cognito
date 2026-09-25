import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "./authentication.guard";

/**
 * Decorator for the AuthenticationGuard
 * @returns {ClassDecorator} - The decorator
 */
export function Authentication(): ClassDecorator & MethodDecorator {
  return applyDecorators(UseGuards(AuthenticationGuard));
}
