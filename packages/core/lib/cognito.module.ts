import { DynamicModule, Module, Provider } from "@nestjs/common";
import { cognitoProviders } from "./cognito.providers";
import {
  COGNITO_CLIENT_INSTANCE_TOKEN,
  COGNITO_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from "./cognito.constants";
import {
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
  CognitoModuleOptionsFactory,
} from "./interfaces/cognito-module.options";
import {
  createCognitoIdentityProviderClientInstance,
  createCognitoIdentityProviderInstance,
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
          provide: COGNITO_INSTANCE_TOKEN,
          useValue: createCognitoIdentityProviderInstance(options),
        },
        {
          provide: COGNITO_CLIENT_INSTANCE_TOKEN,
          useValue: createCognitoIdentityProviderClientInstance(options),
        },
      ],
      exports: [COGNITO_INSTANCE_TOKEN, COGNITO_CLIENT_INSTANCE_TOKEN],
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
      exports: [COGNITO_INSTANCE_TOKEN, COGNITO_CLIENT_INSTANCE_TOKEN],
    };
  }

  /**
   * Create the async providers
   * @param {CognitoModuleAsyncOptions} options - The CognitoModuleAsyncOptions
   * @returns {Provider[]} - The providers
   */
  private static createAsyncProviders(
    options: CognitoModuleAsyncOptions
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
    options: CognitoModuleAsyncOptions
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
