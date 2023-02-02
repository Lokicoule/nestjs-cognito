import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import {
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
  COGNITO_INSTANCE_TOKEN,
} from "@nestjs-cognito/core";
import { Test } from "@nestjs/testing";
import { CognitoTestingModule } from "./cognito-testing.module";

describe("CognitoTestingModule", () => {
  describe("register", () => {
    it("should provide the cognito identity provider", async () => {
      const module = await Test.createTestingModule({
        imports: [
          CognitoTestingModule.register({
            userPoolId: "us-east-1_123456789",
          }),
        ],
      }).compile();

      const cognito = module.get<CognitoIdentityProvider>(
        COGNITO_INSTANCE_TOKEN
      );
      expect(cognito).toBeDefined();
    });
  });

  describe("registerAsync", () => {
    describe("when the `useFactory` option is used", () => {
      it("should provide the cognito identity provider", async () => {
        const module = await Test.createTestingModule({
          imports: [
            CognitoTestingModule.registerAsync({
              useFactory: () => ({
                userPoolId: "us-east-1_123456789",
              }),
            }),
          ],
        }).compile();

        const cognito = module.get<CognitoIdentityProvider>(
          COGNITO_INSTANCE_TOKEN
        );
        expect(cognito).toBeDefined();
      });
    });

    describe("when the `useClass` option is used", () => {
      it("should provide cognito identity provider", async () => {
        const module = await Test.createTestingModule({
          imports: [
            CognitoTestingModule.registerAsync({
              useClass: class TestService
                implements CognitoModuleOptionsFactory
              {
                createCognitoModuleOptions(): CognitoModuleOptions {
                  return {
                    userPoolId: "us-east-1_123456789",
                  };
                }
              },
            }),
          ],
        }).compile();

        const cognito = module.get<CognitoIdentityProvider>(
          COGNITO_INSTANCE_TOKEN
        );
        expect(cognito).toBeDefined();
      });
    });
  });
});
