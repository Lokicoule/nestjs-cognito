import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { TOKEN_USE_KEY } from "../token-use";
import { AuthorizationGuard } from "./authorization.guard";
import { AuthorizationOptions } from "./authorization.options";

/**
 * Decorator for the AuthorizationGuard
 * @returns {ClassDecorator} - The decorator
 * @param {AuthorizationOptions} options - The options
 */
export function Authorization(
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
