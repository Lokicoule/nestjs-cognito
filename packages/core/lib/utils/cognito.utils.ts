import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from "@nestjs/common";
import {
  JwtRsaVerifier,
  CognitoJwtVerifier as JwtVerifier,
} from "aws-jwt-verify";
import { CognitoJwtVerifier } from "../adapters/cognito-jwt-verifier.adapter";

import type { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import type { CognitoModuleOptions } from "../interfaces/cognito-module.options";

/**
 * Creates an instance of CognitoJwtVerifier based on the provided Cognito module options.
 * @param cognitoModuleOptions - The Cognito module options.
 * @returns An instance of CognitoJwtVerifier or null if no verifier is specified.
 */
export const createCognitoJwtVerifierInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
): CognitoJwtVerifier => {
  const { jwtVerifier, jwtRsaVerifier } = cognitoModuleOptions;

  if (jwtVerifier) {
    if (Array.isArray(jwtVerifier)) {
      return CognitoJwtVerifier.create({
        jwtVerifier: JwtVerifier.create(jwtVerifier),
      });
    }

    return CognitoJwtVerifier.create({
      jwtVerifier: JwtVerifier.create(jwtVerifier),
    });
  } else if (jwtRsaVerifier) {
    if (Array.isArray(jwtRsaVerifier)) {
      return CognitoJwtVerifier.create({
        JwtRsaVerifier: JwtRsaVerifier.create(jwtRsaVerifier),
      });
    }

    return CognitoJwtVerifier.create({
      JwtRsaVerifier: JwtRsaVerifier.create(jwtRsaVerifier),
    });
  }

  return null;
};

export const createCognitoJwtRsaVerifierInstance = (
  cognitoModuleOptions: CognitoModuleOptions,
) => {
  const jwtRsaVerifier = cognitoModuleOptions?.jwtRsaVerifier;

  if (!jwtRsaVerifier) {
    return null;
  }

  if (Array.isArray(jwtRsaVerifier)) {
    return JwtRsaVerifier.create(jwtRsaVerifier);
  }

  return JwtRsaVerifier.create(jwtRsaVerifier);
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
