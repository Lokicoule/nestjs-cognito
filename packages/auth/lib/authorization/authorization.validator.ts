import { AbstractValidator } from "../validators/abstract.validator";
import { ValidatorChainBuilder } from "../validators/validator.builder";
import { AuthorizationOptions } from "./authorization.options";
import { AllowedGroupsValidator } from "./validators/allowed-groups.validator";
import { ProhibitedGroupsValidator } from "./validators/prohibited-groups.validator";
import { RequiredGroupsValidator } from "./validators/required-groups.validator";

const DEFAULT_AUTHORIZATION_VALIDATION = "DEFAULT_AUTHORIZATION_VALIDATION";
const STRICT_AUTHORIZATION_VALIDATION = "STRICT_AUTHORIZATION_VALIDATION";

export const AuthorizationValidator = {
  DEFAULT_AUTHORIZATION_VALIDATION: ValidatorChainBuilder.create()
    .with(new AllowedGroupsValidator())
    .with(new ProhibitedGroupsValidator())
    .build(),
  STRICT_AUTHORIZATION_VALIDATION: ValidatorChainBuilder.create()
    .with(new ProhibitedGroupsValidator())
    .with(new RequiredGroupsValidator())
    .build(),

  /**
   * Creates a new authorization validator.
   * @param options
   * @returns {AbstractValidator}
   */
  useFactory(options: AuthorizationOptions): AbstractValidator {
    let validator = AuthorizationValidator[DEFAULT_AUTHORIZATION_VALIDATION];
    if (!Array.isArray(options) && options.requiredGroups) {
      validator = AuthorizationValidator[STRICT_AUTHORIZATION_VALIDATION];
    }
    return validator;
  },
};
