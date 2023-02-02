import { COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY } from "@nestjs-cognito/auth";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/**
 * Decorator that can be used to inject the cognito user into a resolver.
 * @param {string} [propertyName] The name of the property to inject the user into.
 * @returns {(target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => any}
 * @example @CognitoUser() user: User
 * @example @CognitoUser("username") username: string
 * @example @CognitoUser(["cognito:username", "email"]) { username, email }: { username: string, email: string }
 */
export const GqlCognitoUser = createParamDecorator(
  (data: string | string[], ctx: ExecutionContext) => {
    const request = GqlExecutionContext.create(ctx).getContext().req;
    const payload = request[COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY];

    if (!data) {
      return payload;
    }

    if (Array.isArray(data)) {
      return data.reduce((result, key) => {
        result[key] = payload[`cognito:${key}`] || payload[key];
        return result;
      }, {});
    }

    return payload[`cognito:${data}`] || payload[data];
  }
);
