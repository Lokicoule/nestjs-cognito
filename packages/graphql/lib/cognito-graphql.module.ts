import { DynamicModule, Global, Module } from "@nestjs/common";
import {
  CognitoModule,
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
} from "@nestjs-cognito/core";

@Global()
@Module({})
export class CognitoGraphQLModule {
  static register(config: CognitoModuleOptions): DynamicModule {
    return {
      module: CognitoGraphQLModule,
      imports: [CognitoModule.register(config)],
      exports: [CognitoModule],
    };
  }

  static registerAsync(options: CognitoModuleAsyncOptions): DynamicModule {
    return {
      module: CognitoGraphQLModule,
      imports: [CognitoModule.registerAsync(options)],
      exports: [CognitoModule],
    };
  }
}
