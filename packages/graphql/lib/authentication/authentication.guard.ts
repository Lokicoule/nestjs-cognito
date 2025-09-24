import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthenticationGuard as CoreAuthenticationGuard } from "@nestjs-cognito/auth";
import { parseCookies } from "@nestjs-cognito/core";

@Injectable()
export class AuthenticationGuard extends CoreAuthenticationGuard {
  /**
   * Get the request from the context.
   *
   * @param {ExecutionContext} context - The context
   * @returns {Request} - The request
   * @memberof AuthenticationGuard
   */
  public getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context).getContext();

    const request = ctx.req;

    // Support graphql-ws by extracting cookies from the extra property
    const wsCookieString = request?.extra?.request?.headers?.cookie;

    if (wsCookieString) {
      request.cookies = parseCookies(wsCookieString);
    }

    return request;
  }
}
