import { createMock } from "@golevelup/ts-jest";
import { CognitoJwtExtractor, CognitoJwtVerifier } from "@nestjs-cognito/core";
import { ExecutionContext } from "@nestjs/common";
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
  let jwtExtractor: jest.Mocked<CognitoJwtExtractor>;
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

    jwtExtractor = createMock<CognitoJwtExtractor>({
      hasAuthenticationInfo: jest.fn().mockReturnValue(true),
      getAuthorizationToken: jest.fn().mockReturnValue("valid-token"),
    });

    reflector = createMock<Reflector>({
      get: jest.fn().mockReturnValue(false),
    });

    guard = new TestGuard(jwtVerifier, reflector, jwtExtractor);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  describe("Request's context", () => {
    it("should be defined", () => {
      expect(guard.getRequest(createMock<ExecutionContext>())).toBeDefined();
    });

    it("should be undefined", () => {
      const badGuard = new BadTestGuard(jwtVerifier, reflector, jwtExtractor);
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
          message: "No authentication credentials provided",
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
          message: "Authentication failed",
          cause: new Error("Token invalid"),
        });
      });

      it("should support custom token extractor", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          cookies: "access_token=valid-token;",
        });

        const tokenExtractor = createMock<CognitoJwtExtractor>({
          hasAuthenticationInfo(): boolean {
            return true;
          },

          getAuthorizationToken: jest.fn().mockImplementation((request) => {
            // Quick extract from cookies
            return request?.cookies.split(";")[0].split("=")[1];
          }),
        });

        const g = new TestGuard(jwtVerifier, reflector, tokenExtractor);
        expect(await g.canActivate(context)).toBeTruthy();
      });
    });

    describe("Public Routes", () => {
      beforeEach(() => {
        reflector.get.mockReturnValue(true);
      });

      it("should allow access without auth headers", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({});

        await expect(guard.canActivate(context)).resolves.toBe(true);
      });

      it("should throw UnauthorizedException with invalid token", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "Bearer invalid-token",
          },
        });

        jwtVerifier.verify.mockRejectedValue(new Error("Invalid token"));

        await expect(guard.canActivate(context)).rejects.toMatchObject({
          message: "Authentication failed",
          cause: new Error("Invalid token"),
        });
      });

      it("should allow access with empty authorization header (treated as no auth)", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "",
          },
        });

        await expect(guard.canActivate(context)).resolves.toBe(true);
      });

      it("should allow access with no authorization header", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {},
        });

        await expect(guard.canActivate(context)).resolves.toBe(true);
      });

      it("should allow access with spaces-only authorization header", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "   ",
          },
        });

        await expect(guard.canActivate(context)).resolves.toBe(true);
      });

      it("should validate token if Bearer prefix is present", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "Bearer ",
          },
        });

        await expect(guard.canActivate(context)).rejects.toMatchObject({
          message: "Missing token in Authorization header",
        });
      });

      it("should allow access with valid token", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: "Bearer valid-token",
          },
        });

        await expect(guard.canActivate(context)).resolves.toBe(true);
      });
    });

    describe("WebSocket Support", () => {
      it("should handle WebSocket handshake headers with valid token", async () => {
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

      it("should throw UnauthorizedException for WebSocket with invalid token", async () => {
        const context = createMock<ExecutionContext>();
        context.switchToHttp().getRequest.mockReturnValue({
          handshake: {
            headers: {
              authorization: "Bearer invalid-token",
            },
          },
        });

        jwtVerifier.verify.mockRejectedValue(new Error("Token invalid"));

        await expect(guard.canActivate(context)).rejects.toMatchObject({
          message: "Authentication failed",
          cause: new Error("Token invalid"),
        });
      });
    });
  });
});
