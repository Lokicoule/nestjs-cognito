# @nestjs-cognito/core

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
![npm](https://img.shields.io/npm/dt/%40nestjs-cognito%2Fcore)

## Changelog

- `CognitoIdentityProviderClient` has been removed from the `@nestjs-cognito/core` package.
- `InjectCognitoIdentityProviderClient` has been removed from the `@nestjs-cognito/core` package.
- `JwtRsaVerifier` support has been added to the `@nestjs-cognito/core` package.
- `InjectCognitoJwtVerifier` provides access to the `JwtRsaVerifier` and `JwtVerifier` instances from the adapter [`CognitoJwtVerifier`](#cognitojwtverifier).

## Table of contents

- [Description](#description)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Options Parameters](#options-parameters)
  - [`JwtVerifier`](#jwtverifier)
  - [`JwtRsaVerifier`](#jwtrsaverifier)
  - [Synchronously](#synchronously)
  - [Asynchronously](#asynchronously)
- [Usage](#usage)
  - [Cognito Identity Provider](#cognito-identity-provider)
  - [AWS JWT Verify](#aws-jwt-verify)
    - [CognitoJwtVerifier](#cognitojwtverifier)
      - [Methods](#methods)
      - [Properties](#properties)

## Description

The `@nestjs-cognito/core` package simplifies integrating Amazon Cognito user pools into your NestJS applications. It provides a user-friendly interface for:

- Verifying JWT tokens issued by Amazon Cognito.
- (Optional) Interacting with the Amazon Cognito Identity Provider for actions like creating user pools or managing users.

This package leverages the `@aws-sdk/client-cognito-identity-provider` and `aws-jwt-verify` packages under the hood. It streamlines their usage within the NestJS framework.

## Installation

To install the `@nestjs-cognito/core` module, run the following command:

```bash
npm install @nestjs-cognito/core
```

**Note:** In addition to `@nestjs-cognito/core`, you might need to install one or both of the following packages depending on your use case:

- `@aws-sdk/client-cognito-identity-provider`: Required if you intend to interact with the Cognito Identity Provider.
- `aws-jwt-verify`: Required for verifying JWT tokens if you're not using the `@nestjs-cognito/auth` module.

**Important:** If you choose to use the `@nestjs-cognito/auth` module for authentication and authorization functionalities, you won't need to install `aws-jwt-verify` separately. `@nestjs-cognito/auth` depends on `@nestjs-cognito/core` and includes `aws-jwt-verify` internally.

## Configuration

### Options Parameters

The `CognitoModuleOptions` interface defines the configuration options for the `@nestjs-cognito/core` module. It consists of three properties:

- `identityProvider` (Optional): Configuration object for the `@aws-sdk/client-cognito-identity-provider` package.
- `jwtVerifier` (Optional): Configuration object for the `aws-jwt-verify` package (supports single or multiple user pools).
- `jwtRsaVerifier` (Optional): Configuration object for the `aws-jwt-verify` package (supports single or multiple issuers).

You can use the `CognitoModuleOptionsFactory` interface to create the `CognitoModuleOptions` asynchronously using properties like `imports`, `providers`, `exports`, and `name`.

`CognitoModuleAsyncOptions` is another interface for asynchronous configuration. It includes properties like `imports`, `inject`, `useFactory`, and `extraProviders`.

### `JwtVerifier`

| Option Name           | Description                                                                                                                                                                    | Required | Default Value |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------- |
| userPoolId            | The ID of the Cognito User Pool you want to verify JWTs for.                                                                                                                   | Yes      | N/A           |
| clientId              | The expected client ID in the JWT's aud (audience) claim (or client_id claim for access tokens). Can be a string or an array of strings (one must match).                      | Optional | N/A           |
| tokenUse              | The expected token use (id or access) specified in the JWT's token_use claim.                                                                                                  | Optional | N/A           |
| groups                | An optional string or array of strings representing groups that must be present in the JWT's "cognito:groups" claim (at least one must match).                                 | Optional | N/A           |
| scope                 | An optional string or array of strings representing scopes that must be present in the JWT's scope claim (at least one must match).                                            | Optional | N/A           |
| graceSeconds          | The number of seconds of grace period to account for clock skew between systems during verification (e.g., to allow for a slight time difference).                             | Optional | 0             |
| customJwtCheck        | An optional custom function to perform additional checks on the decoded JWT header, payload, and JWK used for verification. Throw an error in this function to reject the JWT. | Optional | N/A           |
| includeRawJwtInErrors | A boolean flag indicating whether to include the raw decoded contents of an invalid JWT in the error object when verification fails. Useful for debugging purposes.            | Optional | false         |
| additionalProperties  | An optional object containing `jwksCache` for caching JWKS keys for faster verification.                                                                                       | Optional | N/A           |

### `JwtRsaVerifier`

<!-- Option Name	Description	Required	Default Value
audience	The expected audience(s) in the JWT's aud claim (one must match). Can be a string or an array of strings.	Optional	N/A
scope	An optional string or array of strings representing scopes that must be present in the JWT's scope claim (at least one must match).	Optional	N/A
graceSeconds	The number of seconds of grace period to allow for clock skew between systems during verification (e.g., to account for a slight time difference).	Optional	0
customJwtCheck	An optional custom function to perform additional checks on the decoded JWT header, payload, and JWK used for verification. Throw an error in this function to reject the JWT.	Optional	N/A
includeRawJwtInErrors	A boolean flag indicating whether to include the raw decoded contents of an invalid JWT in the error object when verification fails. Useful for debugging purposes.	Optional	false -->

| Option Name           | Description                                                                                                                                                                    | Required | Default Value |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------- |
| audience              | The expected audience(s) in the JWT's aud claim (one must match). Can be a string or an array of strings.                                                                      | Optional | N/A           |
| scope                 | An optional string or array of strings representing scopes that must be present in the JWT's scope claim (at least one must match).                                            | Optional | N/A           |
| graceSeconds          | The number of seconds of grace period to allow for clock skew between systems during verification (e.g., to account for a slight time difference).                             | Optional | 0             |
| customJwtCheck        | An optional custom function to perform additional checks on the decoded JWT header, payload, and JWK used for verification. Throw an error in this function to reject the JWT. | Optional | N/A           |
| includeRawJwtInErrors | A boolean flag indicating whether to include the raw decoded contents of an invalid JWT in the error object when verification fails. Useful for debugging purposes.            | Optional | false         |
| additionalProperties  | An optional object containing `jwksCache` for caching JWKS keys for faster verification.                                                                                       | Optional | N/A           |

**Note:** The `jwtVerifier` and `jwtRsaVerifier` properties are mutually exclusive. You can use either one of them, but not both simultaneously.

### Synchronously

The `CognitoModule.register` method takes an options object that implements the `CognitoModuleOptions` interface as a parameter. This options object can contain configurations for both the `jwtVerifier` and `identityProvider`.

**Important:**

- Use the `identityProvider` configuration if you plan to interact with the Cognito Identity Provider functions.
- Omit the `identityProvider` if you only need JWT verification functionality.

```typescript
import { CognitoModule } from "@nestjs-cognito/core";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoModule.register({
      // JWT verification for a single user pool
      jwtVerifier: {
        userPoolId: "your_user_pool_id",
        clientId: "your_client_id",
        tokenUse: "id",
      },
      // OR (Multiple user pools)
      /* jwtVerifier: [
        {
          userPoolId: "user_pool_id_1",
          clientId: "client_id_1",
          tokenUse: "id",
        },
        {
          userPoolId: "user_pool_id_2",
          clientId: "client_id_2",
          tokenUse: "id",
        },
      ], */
      // Identity Provider configuration (optional)
      identityProvider: {
        region: "us-east-1",
      },
    }),
  ],
})
export class AppModule {}
```

### Asynchronously

For asynchronous configuration, use `CognitoModule.registerAsync`. This allows you to import your `ConfigModule` and inject `ConfigService` for utilizing environment variables:

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
        // OR (Multiple user pools)
        /* jwtVerifier: [
          {
            userPoolId: configService.get("COGNITO_USER_POOL_ID_1") as string,
            clientId: configService.get("COGNITO_CLIENT_ID_1"),
            tokenUse: "id",
          },
          {
            userPoolId: configService.get("COGNITO_USER_POOL_ID_2") as string,
            clientId: configService.get("COGNITO_CLIENT_ID_2"),
            tokenUse: "id",
          },
        ], */
        // You can also use jwtRsaVerifier instead of jwtVerifier
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Usage

This module allows you to interact with Amazon Cognito for functionalities like:

- Verifying JWT tokens issued by your Cognito user pool.
- (Optional) Utilizing the Cognito Identity Provider for managing user pools or users (if configured).

Consider using the `@nestjs-cognito/auth` module for authentication and authorization functionalities. It builds upon `@nestjs-cognito/core` and includes JWT verification functionality, eliminating the need to install `aws-jwt-verify` separately.

### Cognito Identity Provider

```ts
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { InjectCognitoIdentityProvider } from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider
  ) {}
}
```

### AWS JWT Verify

```ts
import {
  CognitoJwtVerifier,
  InjectCognitoJwtVerifier
} from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier CognitoJwtVerifier
  ) {}
}
```

#### CognitoJwtVerifier

It's a wrapper for the `aws-jwt-verify` package. It provides a simplified interface for verifying JWT tokens from Amazon Cognito.

#### Methods

- `verify(token: string): Promise<CognitoJwtPayload> | Promise<JwtPayload>` - Verifies the given token.

#### Properties

- `jwtVerifier: JwtVerifier` - The instance of the `JwtVerifier` class from the `aws-jwt-verify` package.

- `jwtRsaVerifier: JwtRsaVerifier` - The instance of the `JwtRsaVerifier` class from the `aws-jwt-verify` package.
