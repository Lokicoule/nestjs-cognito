import {
  CognitoModule,
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
} from "@nestjs-cognito/core";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { CognitoTestingController } from "./cognito-testing.controller";
import { CognitoTestingService } from "./cognito-testing.service";

@Global()
@Module({
  controllers: [CognitoTestingController],
  providers: [CognitoTestingService],
})
export class CognitoTestingModule {
  static register(config: CognitoModuleOptions): DynamicModule {
    return {
      module: CognitoTestingModule,
      imports: [CognitoModule.register(config)],
      exports: [CognitoModule],
    };
  }

  static registerAsync(options: CognitoModuleAsyncOptions): DynamicModule {
    return {
      module: CognitoTestingModule,
      imports: [CognitoModule.registerAsync(options)],
      exports: [CognitoModule],
    };
  }
}
