import { parseCookies } from "@nestjs-cognito/core";
import { Injectable } from "@nestjs/common";
import { AbstractGuard } from "../abstract.guard";
import { User } from "../user/user.model";
import { AuthenticationValidator } from "./authentication.validator";

import type { ExecutionContext } from "@nestjs/common";

@Injectable()
export class AuthenticationGuard extends AbstractGuard {
  /**
   * Get the request from the context
   * @param {ExecutionContext} context - The context
   * @returns {Request} - The request
   */
  public getRequest(context: ExecutionContext): object {
    switch (context.getType<string>()) {
      case "ws":
        return context.switchToWs().getClient();
      case "rpc":
        return context.switchToRpc().getData();
      case "graphql":
        return getGraphqlRequest(context);
      default:
        return context.switchToHttp().getRequest();
    }
  }

  /**
   * Check if the user is authenticated
   * @param {User} user - The user
   * @returns {boolean} - True if the user is authenticated
   */
  public onValidate(user?: User): boolean {
    return AuthenticationValidator.useFactory().validate(user);
  }
}

type GraphqlRequest = {
  cookies?: Record<string, string>;
  extra?: { request?: { headers?: { cookie?: string } } };
};

function getGraphqlRequest(context: ExecutionContext): GraphqlRequest {
  const request: GraphqlRequest = context.getArgByIndex(2)?.req;
  // graphql-ws subscriptions carry the connection headers in extra.request.
  const cookie = request?.extra?.request?.headers?.cookie;
  if (cookie && !request.cookies) {
    request.cookies = parseCookies(cookie);
  }
  return request;
}
