import type { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type {
  CognitoJwtVerifierMultiProperties,
  CognitoJwtVerifierProperties,
} from "aws-jwt-verify/cognito-verifier";
import type { JwksCache } from "aws-jwt-verify/jwk";
import type {
  JwtVerifierMultiIssuer as JwtRsaVerifierMultiIssuer,
  JwtVerifierMultiProperties as JwtRsaVerifierMultiProperties,
  JwtVerifierProperties as JwtRsaVerifierProperties,
  JwtVerifierSingleIssuer as JwtRsaVerifierSingleIssuer,
  VerifyProperties,
} from "aws-jwt-verify/jwt-verifier";
import type { CognitoJwtPayload as AwsCognitoJwtPayload } from 'aws-jwt-verify/jwt-model';
import type { CognitoJwtExtractor } from './cognito-jwt-extractor.interface';

export type CognitoJwtPayload = Prettify<AwsCognitoJwtPayload>;

/**
 * Represents a type that can be used as a Cognito JWT RSA verifier.
 * It can be either a single issuer verifier or a multi-issuer verifier.
 */
export type CognitoJwtRsaVerifier = Prettify<
  | JwtRsaVerifierSingleIssuer<JwtRsaVerifierProperties<VerifyProperties>>
  | JwtRsaVerifierMultiIssuer<JwtRsaVerifierMultiProperties<VerifyProperties>>>;

export type JwtVerifierOptions = {
  jwtVerifier: (
    | CognitoJwtVerifierProperties
    | CognitoJwtVerifierMultiProperties[]
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

export type CognitoModuleOptions = Prettify<{
  identityProvider?: CognitoIdentityProviderClientConfig;
  jwtExtractor?: CognitoJwtExtractor;
} & Partial<JwtVerifierOptions | JwtRsaVerifierOptions>>;

/**
 * @interface CognitoModuleOptionsFactory - Metadata for the CognitoModule
 * @property {() => Promise<CognitoModuleOptions>} createCognitoModuleOptions - A factory function to create the CognitoModuleOptions
 * @property {Type<any>[]} imports - The imports to be used by the module
 * @property {Provider[]} providers - The providers to be used by the module
 * @property {(string | Provider)[]} exports - The exports to be used by the module
 * @property {string} name - The name of the module
 */
export interface CognitoModuleOptionsFactory {
  createCognitoModuleOptions():
    | Promise<CognitoModuleOptions>
    | CognitoModuleOptions;
}

/**
 * @interface CognitoModuleAsyncOptions - Options for the CognitoModule
 * @property {Function} imports - Imports the module asyncronously
 * @property {Function} inject - Injects the module asyncronously
 * @property {CognitoModuleOptions} useFactory - The factory function to create the CognitoModuleOptions
 * @property {CognitoModuleOptions} useClass - The class to create the CognitoModuleOptions
 * @property {CognitoModuleOptions} useExisting - The existing instance of the CognitoModuleOptions
 */
export interface CognitoModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  extraProviders?: Provider[];
  inject?: any[];
  useClass?: Type<CognitoModuleOptionsFactory>;
  useExisting?: Type<CognitoModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CognitoModuleOptions> | CognitoModuleOptions;
}

type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;