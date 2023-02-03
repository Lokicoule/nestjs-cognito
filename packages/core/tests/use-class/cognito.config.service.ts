import { CognitoModuleOptionsFactory, CognitoModuleOptions } from "../../lib";

export class CognitoConfigService implements CognitoModuleOptionsFactory {
  createCognitoModuleOptions(): CognitoModuleOptions {
    return {
      jwtVerifier: {
        userPoolId: "us-east-1_123456789",
      },
    };
  }
}
