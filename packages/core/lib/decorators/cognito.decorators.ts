import { Inject } from "@nestjs/common";
import {
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
} from "../cognito.constants";

/**
 * Returns a decorator function that can be used to inject the Cognito Identity Provider instance.
 * @returns The decorator function.
 */
export function InjectCognitoIdentityProvider() {
  return Inject(COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN);
}

/**
 * Inject the CognitoJwtVerifier instance
 * @returns {ParameterDecorator} - The injected CognitoJwtVerifier instance
 */
export function InjectCognitoJwtVerifier() {
  return Inject(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN);
}

/**
 * Inject the CognitoJwtExtractor instance
 * @returns {ParameterDecorator} - The injected CognitoJwtExtractor instance
 * @constructor
 */
export function InjectCognitoJwtExtractor() {
  return Inject(COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN);
}
