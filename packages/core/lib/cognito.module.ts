import { DynamicModule, Module, Provider } from "@nestjs/common";
import {
  COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from "./cognito.constants";
import { cognitoProviders } from "./cognito.providers";
import {
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
} from "./interfaces/cognito-module.options";
import {
  createCognitoIdentityProviderClientInstance,
  createCognitoIdentityProviderInstance,
  createCognitoJwtVerifierInstance,
} from "./utils/cognito.utils";

@Module({})
export class CognitoModule {
  /**
   * Register the module
   * @param {CognitoModuleOptions} options - The CognitoModuleOptions
   * @returns {DynamicModule} - The CognitoModule
   */
  static register(options: CognitoModuleOptions): DynamicModule {
    return {
      module: CognitoModule,
      providers: [
        {
          provide: COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
          useValue: createCognitoIdentityProviderInstance(options),
        },
        {
          provide: COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
          useValue: createCognitoIdentityProviderClientInstance(options),
        },
        {
          provide: COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
          useValue: createCognitoJwtVerifierInstance(options),
        },
      ],
      exports: [
        COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
        COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
        COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
      ],
    };
  }

  /**
   * Register the module
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {DynamicModule} - The CognitoModule
   */
  static registerAsync(options: CognitoModuleAsyncOptions): DynamicModule {
    return {
      module: CognitoModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        ...(options.extraProviders || []),
        ...cognitoProviders,
      ],
      exports: [
        COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
        COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
        COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
      ],
    };
  }

  /**
   * Create the async providers
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {Provider[]} - The providers
   */
  private static createAsyncProviders(
    options: CognitoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  /**
   * Create the async options provider
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {Provider} - The provider
   */
  private static createAsyncOptionsProvider(
    options: CognitoModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: COGNITO_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: COGNITO_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CognitoModuleOptionsFactory) =>
        optionsFactory.createCognitoModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
