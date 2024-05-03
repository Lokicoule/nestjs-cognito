import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from "@nestjs/common";
import { CognitoJwtVerifier as CognitoJwtVerifierAWS } from "aws-jwt-verify";

import type { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import type {
  CognitoJwtVerifierProperties,
  CognitoJwtVerifierSingleUserPool,
  CognitoJwtVerifierMultiUserPool,
  CognitoJwtVerifierMultiProperties,
} from "aws-jwt-verify/cognito-verifier";
import type { CognitoModuleOptions } from "../interfaces/cognito-module.options";

/**
 * Get the CognitoJwtVerifier instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoJwtVerifier} - The CognitoJwtVerifier instance
 */

export const createCognitoJwtVerifierSingleUserPoolInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties> => {
  const jwtVerifier = cognitoModuleOptions.jwtVerifier;

  if (!jwtVerifier || Array.isArray(jwtVerifier)) {
    return null;
  }

  return CognitoJwtVerifierAWS.create(jwtVerifier);
};

/**
 * Get the CognitoJwtVerifierMultiUserPool instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoJwtVerifierMultiUserPool} - The CognitoJwtVerifierMultiUserPool instance
 */
export const createCognitoJwtVerifierMultiUserPoolInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoJwtVerifierMultiUserPool<CognitoJwtVerifierMultiProperties> => {
  const jwtVerifier = cognitoModuleOptions.jwtVerifier;

  if (!jwtVerifier || !Array.isArray(jwtVerifier)) {
    return null;
  }

  return CognitoJwtVerifierAWS.create(jwtVerifier);
};

/**
 * Get the CognitoIdentityProvider instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProvider} - The CognitoIdentityProvider instance
 */
export const createCognitoIdentityProviderInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProvider => {
  if (!Boolean(cognitoModuleOptions.identityProvider)) {
    return null;
  }

  return new CognitoIdentityProvider(
    buildConfigurationFromOptions(
      cognitoModuleOptions.identityProvider,
      "CognitoIdentityProvider",
    ),
  );
};

/**
 * Get the CognitoIdentityProviderClient instance
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @returns {CognitoIdentityProviderClient} - The CognitoIdentityProviderClient instance
 */
export const createCognitoIdentityProviderClientInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoIdentityProviderClient => {
  if (!Boolean(cognitoModuleOptions.identityProvider)) {
    return null;
  }

  return new CognitoIdentityProviderClient(
    buildConfigurationFromOptions(
      cognitoModuleOptions.identityProvider,
      "CognitoIdentityProviderClient",
    ),
  );
};

/**
 * Get the configuration from the CognitoModuleOptions
 * @param {CognitoModuleOptions} options - The CognitoModuleOptions
 * @param {string} from - The name from where the configuration is coming from
 */
function buildConfigurationFromOptions(
  cognitoModuleOptions: CognitoIdentityProviderClientConfig,
  from: string,
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
