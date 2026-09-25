import {
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
  COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
  CognitoModule,
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
  BearerJwtExtractor,
} from "@nestjs-cognito/core";
import type {
  CognitoIdentityProvider,
  InitiateAuthRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { CognitoMockService } from "./cognito-mock.service";
import { CognitoTestingController } from "./cognito-testing.controller";
import { CognitoTestingService } from "./cognito-testing.service";
import { COGNITO_TESTING_OPTIONS } from "./cognito-testing.constants";
import type { CognitoTestingOptions, MockConfig } from "./types";

const MOCK_CONFIG_TOKEN = "MOCK_CONFIG_TOKEN";

@Global()
@Module({
  controllers: [CognitoTestingController],
  providers: [CognitoTestingService, CognitoMockService],
})
export class CognitoTestingModule {
  /**
   * Utility function to create a JWT verifier factory
   */
  static createJwtVerifierFactory() {
    return {
      verify: async (token: string) => {
        const decodedToken = decode(token, { json: true });
        if (!decodedToken) {
          throw new Error("Invalid token");
        }
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }
        return decodedToken;
      },
    };
  }

  private static createMockProviders(mockConfig: MockConfig): Provider[] {
    return [
      {
        provide: MOCK_CONFIG_TOKEN,
        useValue: mockConfig,
      },
      {
        provide: CognitoMockService,
        useFactory: () => {
          const mockService = new CognitoMockService();
          mockService.setMockConfig(mockConfig);
          return mockService;
        },
      },
      {
        provide: COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
        useFactory: (mockService: CognitoMockService) => ({
          verify: async (token: string) => mockService.verifyToken(token),
        }),
        inject: [CognitoMockService],
      },
      {
        provide: COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
        useClass: BearerJwtExtractor,
      },
      {
        provide: COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
        useFactory: (mockService: CognitoMockService) => ({
          initiateAuth: async (request: InitiateAuthRequest) => ({
            AuthenticationResult: mockService.getMockTokens(request.ClientId),
          }),
        }),
        inject: [CognitoMockService],
      },
      {
        provide: CognitoTestingService,
        useFactory: (
          cognitoProvider: CognitoIdentityProvider,
          cognitoMockService: CognitoMockService,
        ) => {
          const service = new CognitoTestingService(
            cognitoProvider,
            cognitoMockService,
          );
          service.setMockConfig(mockConfig);
          return service;
        },
        inject: [COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN, CognitoMockService],
      },
    ];
  }

  static register(
    config: CognitoModuleOptions,
    mockConfig?: MockConfig,
    testingOptions: CognitoTestingOptions = {},
  ): DynamicModule {
    if (mockConfig?.enabled) {
      const providers = this.createMockProviders(mockConfig);
      return {
        module: CognitoTestingModule,
        providers,
        exports: [
          COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
          COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
          COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
          CognitoTestingService,
          CognitoMockService,
        ],
      };
    }

    return {
      module: CognitoTestingModule,
      imports: [CognitoModule.register(config)],
      providers: [
        { provide: COGNITO_TESTING_OPTIONS, useValue: testingOptions },
      ],
      exports: [CognitoModule],
    };
  }

  static registerAsync(
    options: CognitoModuleAsyncOptions,
    mockConfig?: MockConfig,
    testingOptions: CognitoTestingOptions = {},
  ): DynamicModule {
    if (mockConfig?.enabled) {
      const providers = this.createMockProviders(mockConfig);
      return {
        module: CognitoTestingModule,
        providers,
        exports: [
          COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
          COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
          COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
          CognitoTestingService,
          CognitoMockService,
        ],
      };
    }

    return {
      module: CognitoTestingModule,
      imports: [CognitoModule.registerAsync(options)],
      providers: [
        { provide: COGNITO_TESTING_OPTIONS, useValue: testingOptions },
      ],
      exports: [CognitoModule],
    };
  }
}
