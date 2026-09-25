import { parseCookies } from "@nestjs-cognito/core";
import { Injectable } from "@nestjs/common";
import { AbstractGuard } from "../abstract.guard";
import { User } from "../user/user.model";
import { AuthenticationValidator } from "./authentication.validator";

import type { ExecutionContext } from "@nestjs/common";
import type { IncomingHttpHeaders } from "node:http";

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
  headers?: IncomingHttpHeaders;
  cookies?: Record<string, string>;
  connectionParams?: { authorization?: unknown };
  extra?: { request?: { headers?: IncomingHttpHeaders } };
};

function getGraphqlRequest(context: ExecutionContext): GraphqlRequest {
  const request: GraphqlRequest = context.getArgByIndex(2)?.req;
  // graphql-ws subscriptions: req is the graphql-ws context. Expose the
  // connection headers (with connectionParams.authorization) and cookies.
  const headers = request?.extra?.request?.headers;
  if (headers && !request.headers) {
    const { authorization } = request.connectionParams ?? {};
    request.headers =
      typeof authorization === "string"
        ? { ...headers, authorization }
        : headers;
    request.cookies ??= parseCookies(headers.cookie);
  }
  return request;
}
