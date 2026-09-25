import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "./authorization.guard";
import { AuthorizationOptions, TOKEN_USE_KEY } from "@nestjs-cognito/auth";

/**
 * Decorator for the AuthorizationGuard
 * @returns {ClassDecorator} - The decorator
 * @param {AuthorizationOptions} options - The options
 */
export function GqlAuthorization(
  options: AuthorizationOptions,
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    SetMetadata(
      TOKEN_USE_KEY,
      Array.isArray(options) ? undefined : options.tokenUse,
    ),
    UseGuards(AuthorizationGuard(options)),
  );
}
