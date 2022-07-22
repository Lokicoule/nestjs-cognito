import { AuthorizationOptions } from "../authorization.options";
import { User } from "../../user/user.model";
import { AbstractValidator } from "../../validators/abstract.validator";

export class AllowedGroupsValidator extends AbstractValidator {
  public onValidate(user: User, options: AuthorizationOptions): boolean {
    const allowedGroups = Array.isArray(options)
      ? options
      : options.allowedGroups;

    if (Boolean(allowedGroups) && !user.hasSomeGroup(allowedGroups)) {
      return false;
    }
    return true;
  }
}
