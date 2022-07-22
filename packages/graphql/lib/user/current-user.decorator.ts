import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User, COGNITO_USER_CONTEXT_PROPERTY } from "@nestjs-cognito/auth";

/**
 * Decorator that can be used to inject the current user into a resolver.
 * @param {string} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req[COGNITO_USER_CONTEXT_PROPERTY];
  }
);
