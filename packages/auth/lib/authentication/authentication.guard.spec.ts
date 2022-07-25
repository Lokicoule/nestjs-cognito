import { createMock } from "@golevelup/ts-jest";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CognitoService } from "../cognito";
import { CognitoAuthModule } from "../cognito-auth.module";
import { UserBuilder } from "../user/user.builder";
import { AuthenticationGuard } from "./authentication.guard";

describe("AuthenticationGuard", () => {
  let authenticationGuard: AuthenticationGuard;

  describe("Injectable", () => {
    it("should be defined", async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          CognitoAuthModule.register({
            region: "us-east-1",
          }),
        ],
        providers: [AuthenticationGuard],
      }).compile();
      authenticationGuard =
        module.get<AuthenticationGuard>(AuthenticationGuard);
      expect(authenticationGuard).toBeDefined();
    });
  });

  describe("canActivate", () => {
    it("should return true when user is authenticated", async () => {
      const mockContext = createMock<ExecutionContext>();
      authenticationGuard = new AuthenticationGuard(
        createMock<CognitoService>({
          getUser: jest
            .fn()
            .mockReturnValue(new UserBuilder().setUsername("test").build()),
        })
      );

      mockContext.switchToHttp().getRequest.mockReturnValue({
        headers: {
          authorization: "auth",
        },
        user: {
          username: "test",
        },
      });

      expect(await authenticationGuard.canActivate(mockContext)).toBeTruthy();
    });

    it("should thrown an UnauthorizedException when user is undefined", async () => {
      const mockContext = createMock<ExecutionContext>();
      authenticationGuard = new AuthenticationGuard(
        createMock<CognitoService>({
          getUser: jest.fn().mockReturnValue(undefined),
        })
      );
      mockContext.switchToHttp().getRequest.mockReturnValue({
        headers: {
          authorization: "auth",
        },
        user: undefined,
      });

      expect(authenticationGuard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
