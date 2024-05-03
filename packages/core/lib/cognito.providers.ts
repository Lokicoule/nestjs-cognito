import {
  COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_MULTI_USER_POOL_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from "./cognito.constants";
import {
  createCognitoIdentityProviderClientInstance,
  createCognitoIdentityProviderInstance,
  createCognitoJwtVerifierSingleUserPoolInstance,
  createCognitoJwtVerifierMultiUserPoolInstance,
} from "./utils/cognito.utils";

export const cognitoProviders = [
  {
    provide: COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
    useFactory: createCognitoIdentityProviderInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_IDENTITY_PROVIDER_CLIENT_INSTANCE_TOKEN,
    useFactory: createCognitoIdentityProviderClientInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_JWT_VERIFIER_SINGLE_USER_POOL_INSTANCE_TOKEN,
    useFactory: createCognitoJwtVerifierSingleUserPoolInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_JWT_VERIFIER_MULTI_USER_POOL_INSTANCE_TOKEN,
    useFactory: createCognitoJwtVerifierMultiUserPoolInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
];
