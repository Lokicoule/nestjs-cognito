import { AuthorizationOptions } from "../authorization.options";
import { User } from "../../user/user.model";
import { AbstractValidator } from "../../validators/abstract.validator";

export class RequiredScopesValidator extends AbstractValidator {
  public onValidate(user: User, options: AuthorizationOptions): boolean {
    const requiredScopes = Array.isArray(options)
      ? null
      : options.requiredScopes;

    return !requiredScopes || user.hasAllScopes(requiredScopes);
  }
}
