import { AuthorizationOptions } from "../authorization.options";
import { User } from "../../user/user.model";
import { AbstractValidator } from "../../validators/abstract.validator";

export class ProhibitedGroupsValidator extends AbstractValidator {
  public onValidate(user: User, options: AuthorizationOptions): boolean {
    const prohibitedGroups = Array.isArray(options)
      ? null
      : options.prohibitedGroups;

    if (Boolean(prohibitedGroups) && user.hasSomeGroup(prohibitedGroups)) {
      return false;
    }
    return true;
  }
}
