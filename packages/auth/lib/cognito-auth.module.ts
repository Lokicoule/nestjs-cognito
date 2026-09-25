import { DynamicModule, Global, Module, OnModuleInit } from "@nestjs/common";
import {
  CognitoJwtVerifier,
  CognitoModule,
  CognitoModuleAsyncOptions,
  CognitoModuleOptions,
  InjectCognitoJwtVerifier,
} from "@nestjs-cognito/core";

@Global()
@Module({})
export class CognitoAuthModule implements OnModuleInit {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier: CognitoJwtVerifier | null,
  ) {}

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
      imports: [CognitoModule.registerAsync(options)],
      exports: [CognitoModule],
    };
  }

  onModuleInit() {
    if (!this.jwtVerifier) {
      throw new Error(
        "No JWT verifier configured: set jwtVerifier or jwtRsaVerifier",
      );
    }
  }
}
