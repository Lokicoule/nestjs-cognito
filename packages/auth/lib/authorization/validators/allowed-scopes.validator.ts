import { AuthorizationOptions } from "../authorization.options";
import { User } from "../../user/user.model";
import { AbstractValidator } from "../../validators/abstract.validator";

export class AllowedScopesValidator extends AbstractValidator {
  public onValidate(user: User, options: AuthorizationOptions): boolean {
    const allowedScopes = Array.isArray(options) ? null : options.allowedScopes;

    return !allowedScopes || user.hasSomeScope(allowedScopes);
  }
}
