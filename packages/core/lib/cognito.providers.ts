import {
  COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
  COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
  COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
  COGNITO_MODULE_OPTIONS,
} from "./cognito.constants";
import { BearerJwtExtractor } from "./extractors/bearer-jwt.extractor";
import type { CognitoModuleOptions } from "./interfaces/cognito-module.options";
import {
  createCognitoIdentityProviderInstance,
  createCognitoJwtVerifierInstance,
} from "./utils/cognito.utils";

function createCognitoJwtExtractorInstance(
  options: CognitoModuleOptions,
) {
  return options.jwtExtractor || new BearerJwtExtractor();
}

export const cognitoProviders = [
  {
    provide: COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
    useFactory: createCognitoIdentityProviderInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_JWT_VERIFIER_INSTANCE_TOKEN,
    useFactory: createCognitoJwtVerifierInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
  {
    provide: COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN,
    useFactory: createCognitoJwtExtractorInstance,
    inject: [COGNITO_MODULE_OPTIONS],
  },
];
