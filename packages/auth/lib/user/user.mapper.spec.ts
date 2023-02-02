import { UnauthorizedException } from "@nestjs/common";
import { UserMapper } from "./user.mapper";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

describe("UserMapper", () => {
  describe("fromPayload", () => {
    it("should throw an error if the username is not present", () => {
      expect(() => {
        UserMapper.fromCognitoJwtPayload({} as CognitoJwtPayload);
      }).toThrowError(UnauthorizedException);
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
  });
});
