import { CognitoModuleOptionsFactory, CognitoModuleOptions } from "../../lib";

export class CognitoConfigService implements CognitoModuleOptionsFactory {
  createCognitoModuleOptions(): CognitoModuleOptions {
    return {
      region: "us-east-1",
      userPoolId: "us-east-1_123456789",
    };
  }
}
