import {
  COGNITO_CLIENT_INSTANCE_TOKEN,
  COGNITO_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from "./cognito.constants";
import {
  createCognitoIdentityProviderClientInstance,
  createCognitoIdentityProviderInstance,
} from "./utils/cognito.utils";

export const cognitoProviders = [
  {
    provide: COGNITO_INSTANCE_TOKEN,
    useFactory: createCognitoIdentityProviderInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_CLIENT_INSTANCE_TOKEN,
    useFactory: createCognitoIdentityProviderClientInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
];
