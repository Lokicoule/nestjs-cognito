import { UnauthorizedException } from "@nestjs/common";
import { UserMapper } from "./user.mapper";

describe("UserMapper", () => {
  describe("fromGetUserAndDecodedJwt", () => {
    it("should return a valid User with empty groups", () => {
      const user = UserMapper.fromGetUserAndDecodedJwt(
        {
          UserAttributes: [{ Name: "email", Value: "test@email.com" }],
          Username: "test",
        },
        {}
      );
      expect(user).toBeTruthy();
      expect(user.username).toBe("test");
      expect(user.email).toBe("test@email.com");
      expect(user.groups).toEqual([]);
    });

    it("should return a valid User with admin groups", () => {
      const user = UserMapper.fromGetUserAndDecodedJwt(
        {
          UserAttributes: [{ Name: "email", Value: "test@email.com" }],
          Username: "test",
        },
        {
          "cognito:groups": ["admin"],
        }
      );
      expect(user).toBeTruthy();
      expect(user.username).toBe("test");
      expect(user.email).toBe("test@email.com");
      expect(user.groups).toEqual(["admin"]);
    });

    describe("GetUserResponse", () => {
      it("should throw an error when username is missing", () => {
        expect(() =>
          UserMapper.fromGetUserAndDecodedJwt(
            {
              UserAttributes: [{ Name: "email", Value: "test@email.com" }],
              Username: undefined,
            },
            {
              "cognito:groups": ["admin"],
            }
          )
        ).toThrowError(
          new UnauthorizedException(UserMapper.errors["username"])
        );
      });

      it("should throw an error when email is missing", () => {
        expect(() =>
          UserMapper.fromGetUserAndDecodedJwt(
            {
              UserAttributes: [{ Name: "other", Value: "field" }],
              Username: "name",
            },
            {
              "cognito:groups": ["admin"],
            }
          )
        ).toThrowError(new UnauthorizedException(UserMapper.errors["email"]));
      });
    });

    it("should throw an error when missing email and username", () => {
      expect(() =>
        UserMapper.fromGetUserAndDecodedJwt(
          {
            UserAttributes: [{ Name: "other", Value: "field" }],
            Username: undefined,
          },
          {
            "cognito:groups": ["admin"],
          }
        )
      ).toThrowError(new UnauthorizedException(UserMapper.errors["both"]));
    });
  });
});
