import type { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import type {
  FactoryProvider,
  ModuleMetadata,
  Provider,
  Type,
} from "@nestjs/common";
import type {
  CognitoJwtVerifierMultiProperties,
  CognitoJwtVerifierProperties,
} from "aws-jwt-verify/cognito-verifier";
import type { JwksCache } from "aws-jwt-verify/jwk";
import type {
  CognitoAccessTokenPayload as AwsCognitoAccessTokenPayload,
  CognitoIdTokenPayload as AwsCognitoIdTokenPayload,
  CognitoJwtPayload as AwsCognitoJwtPayload,
} from "aws-jwt-verify/jwt-model";
import type {
  JwtVerifierMultiIssuer as JwtRsaVerifierMultiIssuer,
  JwtVerifierMultiProperties as JwtRsaVerifierMultiProperties,
  JwtVerifierProperties as JwtRsaVerifierProperties,
  JwtVerifierSingleIssuer as JwtRsaVerifierSingleIssuer,
  VerifyProperties,
} from "aws-jwt-verify/jwt-verifier";
import type { CognitoJwtExtractor } from "./cognito-jwt-extractor.interface";

/**
 * The custom claims of your user pool, empty by default. Type them with module augmentation:
 * `declare module "@nestjs-cognito/core" { interface CognitoCustomClaims { "custom:tenant"?: string } }`
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CognitoCustomClaims {}

export type CognitoJwtPayload = Prettify<
  AwsCognitoJwtPayload & CognitoCustomClaims
>;
export type CognitoAccessTokenPayload = Prettify<
  AwsCognitoAccessTokenPayload & CognitoCustomClaims
>;
export type CognitoIdTokenPayload = Prettify<
  AwsCognitoIdTokenPayload & CognitoCustomClaims
>;

/**
 * Type guard to check if a payload is an access token
 */
export function isAccessTokenPayload(
  payload: CognitoJwtPayload,
): payload is CognitoAccessTokenPayload {
  return payload.token_use === "access";
}

/**
 * Type guard to check if a payload is an ID token
 */
export function isIdTokenPayload(
  payload: CognitoJwtPayload,
): payload is CognitoIdTokenPayload {
  return payload.token_use === "id";
}

/**
 * Represents a type that can be used as a Cognito JWT RSA verifier.
 * It can be either a single issuer verifier or a multi-issuer verifier.
 */
export type CognitoJwtRsaVerifier = Prettify<
  | JwtRsaVerifierSingleIssuer<JwtRsaVerifierProperties<VerifyProperties>>
  | JwtRsaVerifierMultiIssuer<JwtRsaVerifierMultiProperties<VerifyProperties>>
>;

export type JwtVerifierOptions = {
  jwtVerifier: (
    CognitoJwtVerifierProperties | CognitoJwtVerifierMultiProperties[]
  ) & {
    additionalProperties?: {
      jwksCache: JwksCache;
    };
  };
  jwtRsaVerifier: undefined | null;
};

export type JwtRsaVerifierOptions = {
  jwtVerifier: undefined | null;

  jwtRsaVerifier: (
    | JwtRsaVerifierMultiProperties<VerifyProperties>[]
    | JwtRsaVerifierProperties<VerifyProperties>
  ) & {
    additionalProperties?: {
      jwksCache: JwksCache;
    };
  };
};

export type CognitoModuleOptions = Prettify<
  {
    identityProvider?: CognitoIdentityProviderClientConfig;
    jwtExtractor?: CognitoJwtExtractor;
  } & Partial<JwtVerifierOptions | JwtRsaVerifierOptions>
>;

/**
 * @interface CognitoModuleOptionsFactory - Metadata for the CognitoModule
 * @property {() => Promise<CognitoModuleOptions>} createCognitoModuleOptions - A factory function to create the CognitoModuleOptions
 */
export interface CognitoModuleOptionsFactory {
  createCognitoModuleOptions():
    Promise<CognitoModuleOptions> | CognitoModuleOptions;
}

/**
 * @interface CognitoModuleAsyncOptions - Options for the CognitoModule
 * @property {Function} imports - Imports the module asyncronously
 * @property {Function} inject - Injects the module asyncronously
 * @property {CognitoModuleOptions} useFactory - The factory function to create the CognitoModuleOptions
 * @property {CognitoModuleOptions} useClass - The class to create the CognitoModuleOptions
 * @property {CognitoModuleOptions} useExisting - The existing instance of the CognitoModuleOptions
 */
export interface CognitoModuleAsyncOptions extends Pick<
  ModuleMetadata,
  "imports"
> {
  extraProviders?: Provider[];
  inject?: FactoryProvider["inject"];
  useClass?: Type<CognitoModuleOptionsFactory>;
  useExisting?: Type<CognitoModuleOptionsFactory>;
  useFactory?: FactoryProvider<
    Promise<CognitoModuleOptions> | CognitoModuleOptions
  >["useFactory"];
}

type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;
