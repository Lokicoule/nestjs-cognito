import { UserBuilder } from "../../user/user.builder";
import { User } from "../../user/user.model";
import { ProhibitedGroupsValidator } from "./prohibited-groups.validator";

describe("ProhibitedGroupsValidator", () => {
  it("should be truthy, user doesn't have Admin group", () => {
    const prohibitedGroupsValidator = new ProhibitedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Moderator", "User"])
      .build();

    const options = {
      prohibitedGroups: ["Admin"],
    };
    expect(prohibitedGroupsValidator.onValidate(user, options)).toBeTruthy();
    expect(prohibitedGroupsValidator.validate(user, options)).toBeTruthy();
  });
  it("should be falsy, user has Admin group", () => {
    const prohibitedGroupsValidator = new ProhibitedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Admin", "User"])
      .build();

    const options = {
      prohibitedGroups: ["Admin"],
    };
    expect(prohibitedGroupsValidator.onValidate(user, options)).toBeFalsy();
    expect(prohibitedGroupsValidator.validate(user, options)).toBeFalsy();
  });

  it("should be truthy, prohibitedGroups option is empty", () => {
    const prohibitedGroupsValidator = new ProhibitedGroupsValidator();
    const user: User = new UserBuilder()
      .setUsername("username")
      .setEmail("email")
      .setGroups(["Moderator", "User"])
      .build();

    expect(prohibitedGroupsValidator.onValidate(user, {})).toBeTruthy();
    expect(prohibitedGroupsValidator.validate(user, {})).toBeTruthy();
  });
});
