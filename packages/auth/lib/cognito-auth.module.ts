import { DynamicModule, Global, Module } from "@nestjs/common";
import {
  CognitoModule,
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
} from "@nestjs-cognito/core";
import { JwtModule } from "@nestjs/jwt";
import { CognitoService } from "./cognito/cognito.service";

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [CognitoService],
  exports: [CognitoService],
})
export class CognitoAuthModule {
  static register(config: CognitoModuleOptions): DynamicModule {
    return {
      module: CognitoAuthModule,
      imports: [CognitoModule.register(config)],
      exports: [CognitoModule],
    };
  }

  static registerAsync(options: CognitoModuleAsyncOptions): DynamicModule {
    return {
      module: CognitoAuthModule,
      imports: [
        ...(options.imports || []),
        CognitoModule.registerAsync(options),
      ],
      providers: [...(options.extraProviders || [])],
      exports: [CognitoModule],
    };
  }
}
