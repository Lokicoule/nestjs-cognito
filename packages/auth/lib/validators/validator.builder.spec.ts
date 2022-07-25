import { UserBuilder } from "../user/user.builder";
import { AbstractValidator } from "./abstract.validator";
import { ValidatorChainBuilder } from "./validator.builder";

describe("ValidatorBuilder", () => {
  it("should correctly chain the validators", () => {
    const validator = ValidatorChainBuilder.create()
      .with(
        new (class UserValidator extends AbstractValidator {
          public onValidate(user: any, options: any): boolean {
            return Boolean(user);
          }
        })()
      )
      .with(
        new (class GroupValidator extends AbstractValidator {
          public onValidate(user: any, options: any): boolean {
            return Boolean(options);
          }
        })()
      )
      .build();

    expect(
      validator.validate(new UserBuilder().setUsername("test").build(), {})
    ).toBeTruthy();
    expect(
      validator.validate(new UserBuilder().setUsername("test").build())
    ).toBeFalsy();
    expect(
      validator.validate(undefined, { prohibitedGroups: ["Admin"] })
    ).toBeFalsy();
  });
});
