import { UserBuilder } from "./user.builder";
import { User } from "./user.model";

describe("User", () => {
  describe("hasGroup", () => {
    it("should return true if user has group", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "User"])
        .build();
      expect(user.hasGroup("admin")).toBeTruthy();
    });
    it("should return false if user doesn't have group", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "User"])
        .build();
      expect(user.hasGroup("moderator")).toBeFalsy();
    });
    it("should return false if user has no groups", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .build();
      expect(user.hasSomeGroup(["admin"])).toBeFalsy();
      expect(user.groups).toEqual([]);
    });
  });

  describe("hasSomeGroup", () => {
    it("should return true if user has some group", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "User"])
        .build();
      expect(user.hasSomeGroup(["Admin", "Moderator"])).toBeTruthy();
    });

    it("should return false if user has no shared group", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "User"])
        .build();
      expect(user.hasSomeGroup(["Moderator", "Visitor"])).toBeFalsy();
    });

    it("should return false if user has no groups", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .build();
      expect(user.hasSomeGroup(["Admin", "Moderator"])).toBeFalsy();
    });
  });

  describe("hasAllGroups", () => {
    it("should return true if user has all groups", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "Moderator"])
        .build();
      expect(user.hasAllGroups(["Admin", "Moderator"])).toBeTruthy();
    });
    it("should return false if user has unshared groups", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "Moderator"])
        .build();
      expect(user.hasAllGroups(["Admin", "Visitor"])).toBeFalsy();
    });

    it("should return false if user has no groups", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .build();
      expect(user.hasAllGroups(["Admin", "Moderator"])).toBeFalsy();
    });
  });
});
