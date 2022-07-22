import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from "@nestjs/common";
import { CognitoModuleOptions } from "../interfaces/cognito-module.options";

/**
 * Get the CognitoIdentityProvider instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProvider} - The CognitoIdentityProvider instance
 */
export const createCognitoIdentityProviderInstance = (
  cognitoModuleOptions: CognitoModuleOptions
): CognitoIdentityProvider => {
  return new CognitoIdentityProvider(
    buildConfigurationFromOptions(
      cognitoModuleOptions,
      "CognitoIdentityProvider"
    )
  );
};

/**
 * Get the CognitoIdentityProviderClient instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProviderClient} - The CognitoIdentityProviderClient instance
 */
export const createCognitoIdentityProviderClientInstance = (
  cognitoModuleOptions: CognitoModuleOptions
): CognitoIdentityProviderClient => {
  return new CognitoIdentityProviderClient(
    buildConfigurationFromOptions(
      cognitoModuleOptions,
      "CognitoIdentityProviderClient"
    )
  );
};

/**
 * Get the configuration from the CognitoModuleOptions
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @param {string} from - The name from where the configuration is coming from
 */
function buildConfigurationFromOptions(
  cognitoModuleOptions: CognitoModuleOptions,
  from: string
): CognitoIdentityProviderClientConfig {
  const logger = new Logger(from);
  const { region, ...options } = cognitoModuleOptions;

  if (!Boolean(region)) {
    logger.warn(`The region is missing in the ${from} configuration`);
  }

  return {
    region: region,
    ...options,
  };
}
