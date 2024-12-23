import { createMock } from "@golevelup/ts-jest";
import { CognitoJwtVerifier } from "@nestjs-cognito/core";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
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
  let jwtVerifier: jest.Mocked<CognitoJwtVerifier>;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    jwtVerifier = createMock<CognitoJwtVerifier>({
      verify: jest.fn().mockResolvedValue({
        sub: "sub",
        "cognito:username": "test",
        "cognito:groups": ["test"],
        email: "email",
      }),
    });

    reflector = createMock<Reflector>({
      get: jest.fn().mockReturnValue(false),
    });

    guard = new TestGuard(jwtVerifier, reflector);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  describe("Request's context", () => {
    it("should be defined", () => {
      expect(guard.getRequest(createMock<ExecutionContext>())).toBeDefined();
    });

    it("should be undefined", () => {
      const badGuard = new BadTestGuard(jwtVerifier, reflector);
      expect(
        badGuard.getRequest(createMock<ExecutionContext>()),
      ).toBeUndefined();
    });
  });

  describe("Authentication", () => {
    describe("Protected Routes", () => {
      beforeEach(() => {
        reflector.get.mockReturnValue(false);
      });

      it("should return true with valid token", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "Bearer valid-token",
          },
        });

        expect(await guard.canActivate(context)).toBeTruthy();
      });

      it("should throw UnauthorizedException when no headers present", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({});

        await expect(guard.canActivate(context)).rejects.toMatchObject({
          message: "Authentication failed.",
          cause: new UnauthorizedException("User is not authenticated."),
        });
      });

      it("should throw UnauthorizedException when token verification fails", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "Bearer invalid-token",
          },
        });

        jwtVerifier.verify.mockRejectedValue(new Error("Token invalid"));

        await expect(guard.canActivate(context)).rejects.toMatchObject({
          message: "Authentication failed.",
          cause: new Error("Token invalid"),
        });
      });
    });

    describe("Public Routes", () => {
      beforeEach(() => {
        reflector.get.mockReturnValue(true);
      });

      it("should return true without token", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({});

        expect(await guard.canActivate(context)).toBeTruthy();
      });

      it("should return true with valid token", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "Bearer valid-token",
          },
        });

        expect(await guard.canActivate(context)).toBeTruthy();
      });

      it("should return true even with invalid token", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "Bearer invalid-token",
          },
        });

        jwtVerifier.verify.mockRejectedValue(new Error("Token invalid"));

        expect(await guard.canActivate(context)).toBeTruthy();
      });
    });

    describe("WebSocket Support", () => {
      it("should handle WebSocket handshake headers", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          handshake: {
            headers: {
              authorization: "Bearer valid-token",
            },
          },
        });

        expect(await guard.canActivate(context)).toBeTruthy();
      });
    });
  });
});
