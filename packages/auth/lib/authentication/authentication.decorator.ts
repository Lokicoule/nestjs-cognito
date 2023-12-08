import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "./authentication.guard";

/**
 * Decorator for the AuthenticationGuard
 * @returns {ClassDecorator} - The decorator
 */
export function Authentication(): ClassDecorator & MethodDecorator {
  return (
    target: object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (propertyKey && descriptor) {
      // MethodDecorator
      return applyDecorators(UseGuards(AuthenticationGuard))(
        target,
        propertyKey,
        descriptor,
      );
    } else {
      // ClassDecorator
      return applyDecorators(UseGuards(AuthenticationGuard))(target);
    }
  };
}
