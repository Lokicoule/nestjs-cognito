import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { TOKEN_USE_KEY, TokenUse } from "../token-use";
import { AuthenticationGuard } from "./authentication.guard";

export interface AuthenticationOptions {
  /** Only accept this token type */
  tokenUse?: TokenUse;
}

/**
 * Decorator for the AuthenticationGuard
 * @returns {ClassDecorator} - The decorator
 */
export function Authentication(
  options: AuthenticationOptions = {},
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    SetMetadata(TOKEN_USE_KEY, options.tokenUse),
    UseGuards(AuthenticationGuard),
  );
}
