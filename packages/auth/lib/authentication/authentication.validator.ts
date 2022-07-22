import { AbstractValidator } from "../validators/abstract.validator";
import { ValidatorChainBuilder } from "../validators/validator.builder";
import { AuthenticatedUserValidator } from "./validators/authenticated-user.validator";

export const AuthenticationValidator = {
  useFactory(): AbstractValidator {
    return ValidatorChainBuilder.create()
      .with(new AuthenticatedUserValidator())
      .build();
  },
};
