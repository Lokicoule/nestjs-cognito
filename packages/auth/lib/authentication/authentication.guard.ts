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
        return context.getArgByIndex(2)?.req;
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
