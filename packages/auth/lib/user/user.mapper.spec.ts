import { UnauthorizedException } from "@nestjs/common";
import type { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";
import { UserMapper } from "./user.mapper";

describe("UserMapper", () => {
  describe("fromCognitoJwtPayload", () => {
    it("should throw an error if neither username nor client ID is present", () => {
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

    it("should handle client credentials flow access tokens without username", () => {
      const user = UserMapper.fromCognitoJwtPayload({
        client_id: "client123",
        token_use: "access",
        scope: "api/read api/write",
        "cognito:groups": ["admin"],
      } as unknown as CognitoJwtPayload);
      expect(user).toBeDefined();
      expect(user.username).toBeUndefined();
      expect(user.clientId).toEqual("client123");
      expect(user.email).toBeNull();
      expect(user.groups).toEqual(["admin"]);
    });
  });
});
