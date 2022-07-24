import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { Test } from "@nestjs/testing";
import {
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
} from "./interfaces/cognito-module.options";
import { CognitoModule } from "./cognito.module";
import { COGNITO_INSTANCE_TOKEN } from "./cognito.constants";

describe("CognitoModule", () => {
  describe("register", () => {
    it("should provide the cognito identity provider", async () => {
      const module = await Test.createTestingModule({
        imports: [
          CognitoModule.register({
            region: "us-east-1",
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
            CognitoModule.registerAsync({
              useFactory: () => ({
                region: "us-east-1",
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
            CognitoModule.registerAsync({
              useClass: class TestService
                implements CognitoModuleOptionsFactory
              {
                createCognitoModuleOptions(): CognitoModuleOptions {
                  return {};
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
