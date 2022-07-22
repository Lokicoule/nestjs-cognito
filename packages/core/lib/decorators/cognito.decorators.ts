import { Inject } from "@nestjs/common";
import {
  COGNITO_CLIENT_INSTANCE_TOKEN,
  COGNITO_INSTANCE_TOKEN,
} from "../cognito.constants";

export function InjectCognitoIdentityProvider() {
  return Inject(COGNITO_INSTANCE_TOKEN);
}

export function InjectCognitoIdentityProviderClient() {
  return Inject(COGNITO_CLIENT_INSTANCE_TOKEN);
}
