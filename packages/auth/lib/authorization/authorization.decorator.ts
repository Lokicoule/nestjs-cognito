import { applyDecorators, UseGuards } from "@nestjs/common";
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
  return (
    target: object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (propertyKey && descriptor) {
      // MethodDecorator
      return applyDecorators(UseGuards(AuthorizationGuard(options)))(
        target,
        propertyKey,
        descriptor,
      );
    } else {
      // ClassDecorator
      return applyDecorators(UseGuards(AuthorizationGuard(options)))(target);
    }
  };
}
