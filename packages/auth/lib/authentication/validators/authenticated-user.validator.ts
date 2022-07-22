import { User } from "../../user/user.model";
import { AbstractValidator } from "../../validators/abstract.validator";

export class AuthenticatedUserValidator extends AbstractValidator {
  public onValidate(user?: User): boolean {
    return Boolean(user);
  }
}
