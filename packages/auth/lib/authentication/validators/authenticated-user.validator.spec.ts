import { UserBuilder } from "../../user/user.builder";
import { User } from "../../user/user.model";
import { AuthenticatedUserValidator } from "./authenticated-user.validator";
describe("AuthenticatedUserValidator", () => {
  it("should be truthy", () => {
    const validator = new AuthenticatedUserValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .build();

    expect(validator.onValidate(user)).toBeTruthy();
    expect(validator.validate(user)).toBeTruthy();
  });

  it("should be falsy", () => {
    const validator = new AuthenticatedUserValidator();

    expect(validator.onValidate(undefined)).toBeFalsy();
    expect(validator.validate(undefined)).toBeFalsy();
  });
});
