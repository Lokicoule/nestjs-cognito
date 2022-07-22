import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthenticationGuard as CoreAuthenticationGuard } from "@nestjs-cognito/auth";

@Injectable()
export class AuthenticationGuard extends CoreAuthenticationGuard {
  /**
   * Get the request from the context
   * @param {ExecutionContext} context - The context
   * @returns {Request} - The request
   * @memberof AuthenticationGuard
   */
  public getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req;
  }
}
