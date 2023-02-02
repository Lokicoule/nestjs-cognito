import { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";
import { ModuleMetadata, Provider, Type } from "@nestjs/common";
import {
  CognitoJwtVerifierProperties,
  CognitoJwtVerifierSingleUserPool,
} from "aws-jwt-verify/cognito-verifier";

/**
 * @type CognitoJwtVerifier - The CognitoJwtVerifier instance
 * @property {CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>} - The CognitoJwtVerifierSingleUserPool instance
 */
export type CognitoJwtVerifier =
  CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>;

/**
 * @type CognitoModuleOptions - Options for the CognitoModule
 * @property {CognitoIdentityProviderClientConfig} region - The region to use
 * @property {CognitoJwtVerifierProperties} userPoolId - The user pool id to use
 * @property {CognitoJwtVerifierProperties} clientId - The client id to use
 * @property {CognitoJwtVerifierProperties} tokenUse - The token use to use
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#constructor-property
 * @see https://github.com/awslabs/aws-jwt-verify#readme
 */
export type CognitoModuleOptions = CognitoIdentityProviderClientConfig &
  CognitoJwtVerifierProperties;

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
