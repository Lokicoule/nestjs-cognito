import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from "@nestjs/common";
import {
  JwtVerifier as JwtRsaVerifier,
  CognitoJwtVerifier as JwtVerifier,
} from "aws-jwt-verify";
import { CognitoJwtVerifier } from "../adapters/cognito-jwt-verifier.adapter";

import type { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import { BearerJwtExtractor } from "../extractors/bearer-jwt.extractor";
import type { CognitoJwtExtractor } from "../interfaces/cognito-jwt-extractor.interface";
import type { CognitoModuleOptions } from "../interfaces/cognito-module.options";


export const createCognitoJwtExtractorInstance = (
  options: CognitoModuleOptions,
): CognitoJwtExtractor => {
  return options.jwtExtractor || new BearerJwtExtractor();
}

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
        jwtRsaVerifier: JwtRsaVerifier.create(jwtRsaVerifier),
      });
    }

    return CognitoJwtVerifier.create({
      jwtRsaVerifier: JwtRsaVerifier.create(jwtRsaVerifier),
    });
  }

  return null;
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