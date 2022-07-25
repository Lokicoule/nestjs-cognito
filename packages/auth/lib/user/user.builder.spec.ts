import { UserBuilder } from "./user.builder";
import { User } from "./user.model";

describe("UserBuilder", () => {
  describe("groups", () => {
    it("should lowercase", () => {
      const userBuilder: UserBuilder = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "User"]);

      expect(userBuilder.username).toEqual("username");
      expect(userBuilder.email).toEqual("email");
      expect(userBuilder.groups).toEqual(["admin", "user"]);
    });

    it("should lowercase and return user instance", () => {
      const user: User = new UserBuilder()
        .setUsername("username")
        .setEmail("email")
        .setGroups(["Admin", "User"])
        .build();

      expect(user.username).toEqual("username");
      expect(user.email).toEqual("email");
      expect(user.groups).toEqual(["admin", "user"]);
    });

    it("should return an empty array of groups", () => {
      const user: User = new UserBuilder().setUsername("username").build();
      expect(user.username).toEqual("username");
      expect(user.email).toEqual(undefined);
      expect(user.groups).toEqual([]);
    });
  });
});
