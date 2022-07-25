import { createMock } from "@golevelup/ts-jest";
import {
  ExecutionContext,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { AbstractGuard } from "./abstract.guard";
import { CognitoService } from "./cognito";
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
    guard = new TestGuard(createMock<CognitoService>());
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
        new BadTestGuard(createMock<CognitoService>()).getRequest(
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
        new BadTestGuard(createMock<CognitoService>()).canActivate(context)
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
          authorization: "auth",
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
