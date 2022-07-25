import { UserBuilder } from "../../user/user.builder";
import { User } from "../../user/user.model";
import { AllowedGroupsValidator } from "./allowed-groups.validator";

describe("AllowedGroupsValidator", () => {
  it("should be truthy, user has Admin group", () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Admin", "User"])
      .build();

    const options = {
      allowedGroups: ["Admin"],
    };
    expect(allowedGroupsValidator.onValidate(user, options)).toBeTruthy();
    expect(allowedGroupsValidator.validate(user, options)).toBeTruthy();
  });

  it("should be falsy, user doesn't have Admin group", () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Moderator", "User"])
      .build();

    const options = {
      allowedGroups: ["Admin"],
    };
    expect(allowedGroupsValidator.onValidate(user, options)).toBeFalsy();
    expect(allowedGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it("should be truthy, allowedGroups option is implicit", () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Moderator", "User"])
      .build();

    expect(allowedGroupsValidator.onValidate(user, ["User"])).toBeTruthy();
    expect(allowedGroupsValidator.validate(user, ["User"])).toBeTruthy();
  });

  it("should be truthy, allowedGroups option is empty", () => {
    const allowedGroupsValidator = new AllowedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .build();

    expect(allowedGroupsValidator.onValidate(user, {})).toBeTruthy();
    expect(allowedGroupsValidator.validate(user, {})).toBeTruthy();
  });
});
