import { Inject } from "@nestjs/common";
import {
  COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_MULTI_USER_POOL_INSTANCE_TOKEN,
} from "../cognito.constants";

export function InjectCognitoIdentityProvider() {
  return Inject(COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN);
}

export function InjectCognitoIdentityProviderClient() {
  return Inject(COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN);
}

/**
 * Inject the CognitoJwtVerifier instance
 * @returns {ParameterDecorator} - The injected CognitoJwtVerifier instance
 * @deprecated Use InjectCognitoJwtVerifierSingleUserPool or InjectCognitoJwtVerifierMultiUserPool instead
 */
export function InjectCognitoJwtVerifier() {
  return Inject(COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN);
}

/**
 * Inject the CognitoJwtVerifierSingleUserPool instance
 * @returns {ParameterDecorator} - The injected CognitoJwtVerifierSingleUserPool instance
 */
export function InjectCognitoJwtVerifierSingleUserPool() {
  return Inject(COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN);
}

/**
 * Inject the CognitoJwtVerifierMultiUserPool instance
 * @returns {ParameterDecorator} - The injected CognitoJwtVerifierMultiUserPool instance
 */
export function InjectCognitoJwtVerifierMultiUserPool() {
  return Inject(COGNITO_JWT_VERIFIER_MULTI_USER_POOL_INSTANCE_TOKEN);
}
