import { UserBuilder } from "../../user/user.builder";
import { User } from "../../user/user.model";
import { RequiredGroupsValidator } from "./required-groups.validator";

describe("RequiredGroupsValidator", () => {
  it("should be truthy, user has Admin and User group", () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Admin", "User"])
      .build();

    const options = {
      requiredGroups: ["Admin", "User"],
    };
    expect(requiredGroupsValidator.onValidate(user, options)).toBeTruthy();
    expect(requiredGroupsValidator.validate(user, options)).toBeTruthy();
  });

  it("should be falsy, user doesn't have User group", () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Admin", "Moderator"])
      .build();

    const options = {
      requiredGroups: ["Admin", "User"],
    };
    expect(requiredGroupsValidator.onValidate(user, options)).toBeFalsy();
    expect(requiredGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it("should be truthy, requiredGroups option is empty", () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["moderator", "User"])
      .build();

    expect(requiredGroupsValidator.onValidate(user, {})).toBeTruthy();
    expect(requiredGroupsValidator.validate(user, {})).toBeTruthy();
  });

  it("should be falsy, user has Admin and User group", () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Admin", "User"])
      .build();

    const options = {
      requiredGroups: ["Admin", "User", "Moderator"],
    };
    expect(requiredGroupsValidator.onValidate(user, options)).toBeFalsy();
    expect(requiredGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it("should be truthy, option is an array", () => {
    const requiredGroupsValidator = new RequiredGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Admin", "User"])
      .build();

    const options = ["Admin", "User", "Moderator"];
    expect(requiredGroupsValidator.onValidate(user, options)).toBeTruthy();
    expect(requiredGroupsValidator.validate(user, options)).toBeTruthy();
  });
});
