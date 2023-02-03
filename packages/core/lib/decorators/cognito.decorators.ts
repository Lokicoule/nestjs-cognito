import { Inject } from "@nestjs/common";
import {
  COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
} from "../cognito.constants";

export function InjectCognitoIdentityProvider() {
  return Inject(COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN);
}

export function InjectCognitoIdentityProviderClient() {
  return Inject(COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN);
}

export function InjectCognitoJwtVerifier() {
  return Inject(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN);
}
