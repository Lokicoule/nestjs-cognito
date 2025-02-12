import { UnauthorizedException } from "@nestjs/common";
import { UserMapper } from "./user.mapper";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

describe("UserMapper", () => {
  describe("fromCognitoJwtPayload", () => {
    it("should throw an error if the username is not present", () => {
      expect(() => {
        UserMapper.fromCognitoJwtPayload({} as CognitoJwtPayload);
      }).toThrow(UnauthorizedException);
    });
    it("should return a user if the username is present", () => {
      const user = UserMapper.fromCognitoJwtPayload({
        "cognito:username": "username",
      } as unknown as CognitoJwtPayload);
      expect(user).toBeDefined();
      expect(user.username).toEqual("username");
    });

    it("should return a user if the username and email are present", () => {
      const user = UserMapper.fromCognitoJwtPayload({
        "cognito:username": "username",
        email: "email",
      } as unknown as CognitoJwtPayload);
      expect(user).toBeDefined();
      expect(user.username).toEqual("username");
      expect(user.email).toEqual("email");
    });

    it("should return a full user", () => {
      const user = UserMapper.fromCognitoJwtPayload({
        "cognito:username": "username",
        email: "email",
        "cognito:groups": ["group1", "group2"],
      } as unknown as CognitoJwtPayload);
      expect(user).toBeDefined();
      expect(user.username).toEqual("username");
      expect(user.email).toEqual("email");
      expect(user.groups).toEqual(["group1", "group2"]);
    });

    it("should return a full user with a single group", () => {
      const user = UserMapper.fromCognitoJwtPayload({
        "cognito:username": "username",
        email: "email",
        "cognito:groups": "group1",
      } as unknown as CognitoJwtPayload);
      expect(user).toBeDefined();
      expect(user.username).toEqual("username");
      expect(user.email).toEqual("email");
      expect(user.groups).toEqual(["group1"]);
    });

    it("should handle Cognito usernames and groups without a namespace", () => {
      const user = UserMapper.fromCognitoJwtPayload({
        username: "username",
        email: "email",
        groups: "group1",
      } as unknown as CognitoJwtPayload);
      expect(user).toBeDefined();
      expect(user.username).toEqual("username");
      expect(user.email).toEqual("email");
      expect(user.groups).toEqual(["group1"]);
    });
  });
});
