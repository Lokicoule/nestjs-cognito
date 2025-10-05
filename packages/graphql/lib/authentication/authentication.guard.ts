import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthenticationGuard as CoreAuthenticationGuard } from "@nestjs-cognito/auth";
import { parseCookies } from "../utils/parse-cookies.util";

@Injectable()
export class AuthenticationGuard extends CoreAuthenticationGuard {
  /**
   * Get the request from the GraphQL execution context.
   * For graphql-ws subscriptions, extracts cookies from WebSocket connection headers.
   *
   * @param {ExecutionContext} context - The execution context
   * @returns The request object with cookies populated
   * @memberof AuthenticationGuard
   */
  public getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request = ctx.req;

    // graphql-ws stores WebSocket connection headers in request.extra.request.headers
    // Extract cookies from there if available and not already parsed
    const wsCookieString = request?.extra?.request?.headers?.cookie;

    if (wsCookieString && !request.cookies) {
      request.cookies = parseCookies(wsCookieString);
    }

    return request;
  }
}
