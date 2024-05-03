<h1 align="center">@nestjs-cognito/core</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
![npm](https://img.shields.io/npm/dt/%40nestjs-cognito%2Fcore)

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
- <strong>jwtVerifier</strong> is an optional configuration object for the `aws-jwt-verify` package. It can be either a single user pool configuration or an array of configurations for multi-user pool support.

You can use the <strong>CognitoModuleOptionsFactory</strong> interface for creating the <strong>CognitoModuleOptions</strong> in an asynchronous way, using _imports, providers, exports_, and _name_ properties.

<strong>CognitoModuleAsyncOptions</strong> is another interface for creating the <strong>CognitoModuleOptions</strong> asynchronously. It contains properties such as _imports, inject, useFactory_, and _extraProviders_.

#### CognitoModuleOptionsFactory

| Name                       | Type                                | Description                                           |
| -------------------------- | ----------------------------------- | ----------------------------------------------------- |
| createCognitoModuleOptions | () => Promise<CognitoModuleOptions> | A factory function to create the CognitoModuleOptions |
| imports                    | Type<any>[]                         | The imports to be used by the module                  |
| providers                  | Provider[]                          | The providers to be used by the module                |
| exports                    | (string \| Provider)[]              | The exports to be used by the module                  |
| name                       | string                              | The name of the module                                |

#### CognitoModuleAsyncOptions

| Name        | Type                 | Description                                             |
| ----------- | -------------------- | ------------------------------------------------------- |
| imports     | Function             | Imports the module asyncronously                        |
| inject      | Function             | Injects the module asyncronously                        |
| useFactory  | CognitoModuleOptions | The factory function to create the CognitoModuleOptions |
| useClass    | CognitoModuleOptions | The class to create the CognitoModuleOptions            |
| useExisting | CognitoModuleOptions | The existing instance of the CognitoModuleOptions       |

#### CognitoJwtVerifierSingleUserPool

You can use a single user pool by providing a configuration for the _jwtVerifier_ property.
You will need to use the dedicated decorator `@CognitoJwtVerifierSingleUserPool` to inject the JWT verifier for a single user pool.

| Name        | Type                         | Description                               |
| ----------- | ---------------------------- | ----------------------------------------- |
| jwtVerifier | CognitoJwtVerifierProperties | The JWT verifier for the single user pool |

#### CognitoJwtVerifierMultiUserPool

You can use multiple user pools by providing an array of configurations for the _jwtVerifier_ property.
You will need to use the dedicated decorator `@CognitoJwtVerifierMultiUserPool` to inject the JWT verifier for multiple user pools.

| Name        | Type                              | Description                                  |
| ----------- | --------------------------------- | -------------------------------------------- |
| jwtVerifier | CognitoJwtVerifierMultiProperties | The JWT verifier for the multiple user pools |

#### CognitoModuleOptions

| Name             | Type                                                                                                                                                                                    | Description                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| identityProvider | CognitoIdentityProviderClientConfig                                                                                                                                                     | The configuration for the Cognito identity provider                                                             |
| jwtVerifier      | (CognitoJwtVerifierProperties & { additionalProperties?: { jwksCache: JwksCache; }; }) \| (CognitoJwtVerifierMultiProperties & { additionalProperties?: { jwksCache: JwksCache; }; })[] | The configuration for the JWT verifier. It can be a single object or an array of objects for multiple verifiers |

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
      // Or you can use multiple user pools
      /* jwtVerifier: [
        {
          userPoolId: "user_pool_id",
          clientId: "client_id",
          tokenUse: "id",
        },
        {
          userPoolId: "user_pool_id",
          clientId: "client_id",
          tokenUse: "id",
        },
      ], */
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
        // Or you can use multiple user pools
        /* jwtVerifier: [
          {
            userPoolId: configService.get("COGNITO_USER_POOL_ID") as string,
            clientId: configService.get("COGNITO_CLIENT_ID"),
            tokenUse: "id",
          },
          {
            userPoolId: configService.get("COGNITO_USER_POOL_ID") as string,
            clientId: configService.get("COGNITO_CLIENT_ID"),
            tokenUse: "id",
          },
        ], */
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

As mentioned earlier, the choice between using the dedicated `CognitoJwtVerifierSingleUserPool` or `CognitoJwtVerifierMultiUserPool` depends on your previous configuration in the `CognitoModuleOptions`.

If you have configured a single user pool, you should use the `CognitoJwtVerifierSingleUserPool` and the `@InjectCognitoJwtVerifierSingleUserPool` decorator. If you have configured multiple user pools, you should use the `CognitoJwtVerifierMultiUserPool` and the `@InjectCognitoJwtVerifierMultiUserPool` decorator.

In case you have configured multiple user pools, you can not use the `CognitoJwtVerifierSingleUserPool` and vice-versa.

```ts
import {
  CognitoJwtVerifierSingleUserPool,
  CognitoJwtVerifierMultiUserPool,
  InjectCognitoJwtVerifierSingleUserPool,
  InjectCognitoJwtVerifierMultiUserPool,
} from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoJwtVerifierSingleUserPool()
    private readonly jwtVerifier CognitoJwtVerifierSingleUserPool

    // Or you can use multiple user pools
    /* @InjectCognitoJwtVerifierMultiUserPool()
    private readonly jwtVerifier CognitoJwtVerifierMultiUserPool */
  ) {}
}
```

## License

<b>@nestjs-cognito/core</b> is [MIT licensed](LICENSE).
