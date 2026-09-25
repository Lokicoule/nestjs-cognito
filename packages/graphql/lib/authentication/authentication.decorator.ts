import { AuthenticationOptions, TOKEN_USE_KEY } from "@nestjs-cognito/auth";
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "./authentication.guard";

/**
 * Decorator for the AuthenticationGuard
 * @returns {ClassDecorator} - The decorator
 */
export function GqlAuthentication(
  options: AuthenticationOptions = {},
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    SetMetadata(TOKEN_USE_KEY, options.tokenUse),
    UseGuards(AuthenticationGuard),
  );
}
