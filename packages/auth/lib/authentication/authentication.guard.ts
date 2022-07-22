import { ExecutionContext, Injectable } from "@nestjs/common";
import { AbstractGuard } from "../abstract.guard";
import { User } from "../user/user.model";
import { AuthenticationValidator } from "./authentication.validator";
@Injectable()
export class AuthenticationGuard extends AbstractGuard {
  /**
   * Get the request from the context
   * @param {ExecutionContext} context - The context
   * @returns {Request} - The request
   */
  public getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
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
