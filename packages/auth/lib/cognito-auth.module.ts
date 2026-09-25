import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnModuleInit,
} from "@nestjs/common";
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
  private readonly logger = new Logger(CognitoAuthModule.name);

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

  async onModuleInit() {
    if (!this.jwtVerifier) {
      throw new Error(
        "No JWT verifier configured: set jwtVerifier or jwtRsaVerifier",
      );
    }

    // Overridden verifiers (e.g. CognitoTestingModule mocks) may not hydrate.
    await this.jwtVerifier.hydrate?.().catch((error: Error) => {
      this.logger.warn(`Could not preload the JWKS: ${error.message}`);
    });
  }
}
