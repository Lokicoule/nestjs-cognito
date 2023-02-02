import { createMock } from "@golevelup/ts-jest";
import { CognitoJwtVerifier } from "@nestjs-cognito/core";
import {
  ExecutionContext,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { AbstractGuard } from "./abstract.guard";
import { User } from "./user/user.model";

class TestGuard extends AbstractGuard {
  public onValidate(user: User): boolean {
    return true;
  }

  public getRequest(context: ExecutionContext): any {
    return context.switchToHttp().getRequest();
  }
}

class BadTestGuard extends AbstractGuard {
  public onValidate(user: User): boolean {
    return true;
  }

  public getRequest(context: ExecutionContext): any {
    return undefined;
  }
}

describe("AbstractGuard", () => {
  let guard: TestGuard;

  beforeEach(() => {
    guard = new TestGuard(
      createMock<CognitoJwtVerifier>({
        verify: jest.fn().mockReturnValue({
          sub: "sub",
          "cognito:username": "test",
          "cognito:groups": ["test"],
          email: "email",
        }),
      })
    );
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  describe("Request's context", () => {
    it("should be defined", () => {
      expect(guard.getRequest(createMock<ExecutionContext>())).toBeDefined();
    });

    it("should be undefined", () => {
      expect(
        new BadTestGuard(createMock<CognitoJwtVerifier>()).getRequest(
          createMock<ExecutionContext>()
        )
      ).toBeUndefined();
    });

    it("should throw  ServiceUnavailableException", () => {
      const context = createMock<ExecutionContext>();

      context.switchToHttp().getRequest.mockReturnValue({
        headers: {
          authorization: "auth",
        },
      });

      expect(() =>
        new BadTestGuard(createMock<CognitoJwtVerifier>()).canActivate(context)
      ).rejects.toThrow(
        new ServiceUnavailableException("Request is undefined or null.")
      );
    });
  });

  describe("Header", () => {
    it("should return true with authorization header", async () => {
      const context = createMock<ExecutionContext>();

      context.switchToHttp().getRequest.mockReturnValue({
        headers: {
          authorization: "fake-token",
        },
      });

      expect(await guard.canActivate(context)).toBeTruthy();
    });

    it("should throw error without authorization header", () => {
      const context = createMock<ExecutionContext>();

      expect(() => guard.canActivate(context)).rejects.toThrowError(
        new UnauthorizedException("Authorization header is missing.")
      );
    });
  });
});
