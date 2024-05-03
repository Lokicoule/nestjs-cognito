import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { Test } from "@nestjs/testing";
import {
  CognitoJwtVerifier,
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
} from "./interfaces/cognito-module.options";
import { CognitoModule } from "./cognito.module";
import {
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN,
} from "./cognito.constants";

describe("CognitoModule", () => {
  describe("register", () => {
    it("should provide the cognito identity provider", async () => {
      const module = await Test.createTestingModule({
        imports: [
          CognitoModule.register({
            identityProvider: {
              region: "us-east-1",
            },
          }),
        ],
      }).compile();

      const cognito = module.get<CognitoIdentityProvider>(
        COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
      );
      expect(cognito).toBeDefined();
    });

    it("should provide the cognito jwt verifier", async () => {
      const module = await Test.createTestingModule({
        imports: [
          CognitoModule.register({
            jwtVerifier: {
              userPoolId: "us-east-1_123456789",
            },
          }),
        ],
      }).compile();

      const cognito = module.get<CognitoJwtVerifier>(
        COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN,
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
                identityProvider: {
                  region: "us-east-1",
                },
              }),
            }),
          ],
        }).compile();

        expect(
          module.get<CognitoIdentityProvider>(
            COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
          ),
        ).toBeDefined();
        expect(
          module.get<CognitoJwtVerifier>(
            COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN,
          ),
        ).toBeNull();
      });

      it("should provide the cognito jwt verifier", async () => {
        const module = await Test.createTestingModule({
          imports: [
            CognitoModule.registerAsync({
              useFactory: () => ({
                jwtVerifier: {
                  userPoolId: "us-east-1_123456789",
                },
              }),
            }),
          ],
        }).compile();

        expect(
          module.get<CognitoJwtVerifier>(
            COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN,
          ),
        ).toBeDefined();
        expect(
          module.get<CognitoIdentityProvider>(
            COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
          ),
        ).toBeNull();
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
                  return {
                    identityProvider: {
                      region: "us-east-1",
                    },
                  };
                }
              },
            }),
          ],
        }).compile();

        const cognito = module.get<CognitoIdentityProvider>(
          COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
        );
        expect(cognito).toBeDefined();
      });
    });
  });
});
