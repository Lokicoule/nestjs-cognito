import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { COGNITO_USER_CONTEXT_PROPERTY } from "../user.constants";
import { User } from "../user.model";

/**
 * @deprecated This decorator is deprecated. Use CognitoUser instead. This decorator will be removed in the next major release.
 * Decorator that can be used to inject the current user into a controller.
 * @param {string} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return request[COGNITO_USER_CONTEXT_PROPERTY];
  }
);
