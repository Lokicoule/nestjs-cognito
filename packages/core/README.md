<h1 align="center">@nestjs-cognito/core</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)

## Description

A wrapper package for the [@aws-sdk/client-cognito-identity-provider](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/index.html) and [aws-jwt-verify](https://www.npmjs.com/package/aws-jwt-verify) packages for use with NestJS applications.

This package provides a simplified and NestJS-friendly interface for integrating Amazon Cognito into your application. With this package, you can easily make API requests to Amazon Cognito and verify JWT tokens from Amazon Cognito.

## Installation

To install the `@nestjs-cognito/core` module, run the following command:

```bash
npm install @nestjs-cognito/core
```

In addition to the `@nestjs-cognito/core` package, you will also need to install the `@aws-sdk/client-cognito-identity-provider` and/or `aws-jwt-verify`.

<strong>It's important to note that if you use the `@nestjs-cognito/auth` module, you won't need to install `aws-jwt-verify` manually. The choice of which package to use depends on your specific needs.</strong>

```bash
npm install @aws-sdk/client-cognito-identity-provider aws-jwt-verify
```

## Configuration

### Options params

The <strong>CognitoModuleOptions</strong> interface is the configuration options for the `@nestjs-cognito/core` module. It contains two properties: _identityProvider_ and _jwtVerifier_.

- <strong>identityProvider</strong> is an optional configuration object for the `@aws-sdk/client-cognito-identity-provider` package.
- <strong>jwtVerifier</strong> is an optional configuration object for the `aws-jwt-verify` package.

You can use the <strong>CognitoModuleOptionsFactory</strong> interface for creating the <strong>CognitoModuleOptions</strong> in an asynchronous way, using _imports, providers, exports_, and _name_ properties.

<strong>CognitoModuleAsyncOptions</strong> is another interface for creating the <strong>CognitoModuleOptions</strong> asynchronously. It contains properties such as _imports, inject, useFactory_, and _extraProviders_.

<details>
<summary>Definition</summary>

```ts
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
export type CognitoModuleOptions = {
  identityProvider?: CognitoIdentityProviderClientConfig;
  jwtVerifier?: CognitoJwtVerifierProperties;
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
```

</details>

### Synchronously

Use `CognitoModule.register` method with options of [CognitoModuleOptions interface](#options-params)
The method takes an options object that implements the _CognitoModuleOptions_ interface as a parameter. This options object can contain configurations for both the _jwtVerifier_ and _identityProvider_.

It's important to note that the _identityProvider_ is used in the case where you want to use the Cognito identity provider. If you don't want to use the identity provider, you can omit this configuration from the options object and only specify the _jwtVerifier_ configuration and vice-versa.

```ts
import { CognitoModule } from "@nestjs-cognito/core";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoModule.register({
      jwtVerifier: {
        userPoolId: "user_pool_id",
        clientId: "client_id",
        tokenUse: "id",
      },
      identityProvider: {
        region: "us-east-1",
      },
    }),
  ],
})
export class AppModule {}
```

### Asynchronously

With `CognitoModule.registerAsync` you can import your ConfigModule and inject ConfigService to use it in `useFactory` method.
It's also possible to use `useExisting` or `useClass`.
You can find more details [here](https://docs.nestjs.com/techniques/configuration).

Here's an example:

```ts
import { CognitoModule } from "@nestjs-cognito/core";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CognitoModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get("COGNITO_USER_POOL_ID") as string,
          clientId: configService.get("COGNITO_CLIENT_ID"),
          tokenUse: "id",
        },
        identityProvider: {
          region: configService.get("COGNITO_REGION"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Usage

You can use this module to interact with Amazon Cognito and make use of its functionality. In case you need to handle _authentication_ and _authorization_, you may consider using the `@nestjs-cognito/auth` module, which is built on top of `@nestjs-cognito/core`. In this case, you won't need to install `aws-jwt-verify` manually, as it is already included in the `@nestjs-cognito/auth` module.

### Cognito Identity Provider

```ts
import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  InjectCognitoIdentityProvider,
  InjectCognitoIdentityProviderClient,
} from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    @InjectCognitoIdentityProviderClient()
    private readonly cognitoIdentityProviderClient: CognitoIdentityProviderClient
  ) {}
}
```

### AWS JWT Verify

```ts
import {
  CognitoJwtVerifier,
  InjectCognitoJwtVerifier,
} from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier: CognitoJwtVerifier
  ) {}
}
```

## License

<b>@nestjs-cognito/core</b> is [MIT licensed](LICENSE).
