import type { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import type { ModuleMetadata, Provider, Type } from "@nestjs/common";
import type {
  CognitoJwtVerifierProperties,
  CognitoJwtVerifierSingleUserPool as BaseCognitoJwtVerifierSingleUserPool,
  CognitoJwtVerifierMultiUserPool as BaseCognitoJwtVerifierMultiUserPool,
  CognitoJwtVerifierMultiProperties,
} from "aws-jwt-verify/cognito-verifier";
import type { JwksCache } from "aws-jwt-verify/jwk";

/**
 * Represents a type for Cognito JWT verifier with a single user pool.
 * It is a generic type that takes `CognitoJwtVerifierProperties` as a parameter.
 * @deprecated Use CognitoJwtVerifierSingleUserPool instead
 */
export type CognitoJwtVerifier =
  BaseCognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>;

/**
 * Represents a type for Cognito JWT verifier with a single user pool.
 * It is a generic type that takes `CognitoJwtVerifierProperties` as a parameter.
 */
export type CognitoJwtVerifierSingleUserPool =
  BaseCognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>;

/**
 * Represents a type for Cognito JWT verifier with multiple user pools.
 * It is a generic type that takes `CognitoJwtVerifierMultiProperties` as a parameter.
 */
export type CognitoJwtVerifierMultiUserPool =
  BaseCognitoJwtVerifierMultiUserPool<CognitoJwtVerifierMultiProperties>;

/**
 * Represents the options for the Cognito module.
 */
export type CognitoModuleOptions = {
  /**
   * The configuration for the Cognito identity provider.
   */
  identityProvider?: CognitoIdentityProviderClientConfig;

  /**
   * The configuration for the JWT verifier.
   * It can be a single object or an array of objects for multiple verifiers.
   */
  jwtVerifier?:
    | (CognitoJwtVerifierProperties & {
        /**
         * Additional properties for the JWT verifier.
         */
        additionalProperties?: {
          /**
           * The cache for storing JWKS (JSON Web Key Set) data.
           */
          jwksCache: JwksCache;
        };
      })
    | (CognitoJwtVerifierMultiProperties & {
        /**
         * Additional properties for the JWT verifier.
         */
        additionalProperties?: {
          /**
           * The cache for storing JWKS (JSON Web Key Set) data.
           */
          jwksCache: JwksCache;
        };
      })[];
};

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
