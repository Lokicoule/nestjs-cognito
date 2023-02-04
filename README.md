<h1 align="center">@nestjs-cognito</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)

<details>
  <summary>
    <h1 align="center">@nestjs-cognito/core</h1>
  </summary>

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

</details>

<details>
  <summary>
    <h1 align="center">@nestjs-cognito/auth</h1>
  </summary>

## Description

`@nestjs-cognito/auth` is a library for [NestJS](https://github.com/nestjs/nest) that provides authentication and authorization decorators and guards for applications using [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html). This library is built on top of `@nestjs-cognito/core` and `aws-jwt-verify`.

## Installation

To install the library, use npm:

```bash
npm install @nestjs-cognito/auth
```

## Configuration

The `@nestjs-cognito/auth` library offers both _synchronous_ and _asynchronous_ configuration options. To use the library, a few configuration parameters are required, including the AWS Cognito user pool ID and client ID. Detailed information about the available options can be found in the [@nestjs-cognito/core](https://www.npmjs.com/package/@nestjs-cognito/core) documentation.

### Synchronous Configuration

The `@nestjs-cognito/auth` library can be easily integrated into your NestJS application by importing the `CognitoAuthModule` from the `@nestjs-cognito/auth` package.

Use the `CognitoAuthModule.register` method with options from the [CognitoModuleOptions interface](https://www.npmjs.com/package/@nestjs-cognito/core)

Here's an example of how you can import the `CognitoAuthModule` into your NestJS application:

```ts
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: "user_pool_id",
        clientId: "client_id",
        tokenUse: "id",
      },
    }),
  ],
})
export class AppModule {}
```

In this example, the CognitoAuthModule is imported and registered with the following configuration options:

- `jwtVerifier`:
  - `userPoolId`: The ID of your AWS Cognito user pool.
  - `clientId`: The client ID of your AWS Cognito user pool.
  - `tokenUse`: The type of token to be used. It is recommended to use "id" instead of "access" token.

Note: You can also define an identity provider without importing the [CognitoModule](https://www.npmjs.com/package/@nestjs-cognito/core) module by using the CognitoAuthModule.

### Asynchronous Configuration

With `CognitoModule.registerAsync` you can import a ConfigModule and inject ConfigService to use it in `useFactory` method.
Alternatively, you can use `useExisting` or `useClass`.
You can find more information about asynchronous configuration in the [NestJS documentation](https://docs.nestjs.com/techniques/configuration).

```ts
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get("COGNITO_USER_POOL_ID") as string,
          clientId: configService.get("COGNITO_CLIENT_ID"),
          tokenUse: "id",
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Usage

Once the `@nestjs-cognito/auth` module is installed and configured, you can use the following decorators and guards to protect your controllers and routes.

### Built-in Decorators and Guards

- Use the `@Authentication` decorator or the `@UseGuards(AuthenticationGuard)` syntax to apply the `AuthenticationGuard` to a controller and ensure that the user is authenticated.
- Use the `@Authorization` decorator or the `@UseGuards(AuthorizationGuard)` syntax to apply the `AuthorizationGuard` to a controller and ensure that the user is authorized.
- Decorate method arguments with the `@CognitoUser` decorator to retrieve the payload information extracted from the JWT.

<b>Note: During the authorization process, the authentication of the user is already checked, so there's no need to use the `authentication` guard or decorator.</b>

In addition, you can find more details about `@UseGuards` decorator from the official [NestJS](https://docs.nestjs.com/guards) documentation.

### `Authentication`

#### `@Authentication` Decorator

To configure the authentication, you'll need to use the `@Authentication` decorator. You can add the `@Authentication` decorator to controllers or routes:

```ts
import { Authentication } from "@nestjs-cognito/auth";
import { Controller } from "@nestjs/common";

@Controller("dogs")
@Authentication()
export class DogsController {
  // Your routes here
}
```

#### `AuthenticationGard`

You can also use the `AuthenticationGuard` to secure individual routes or endpoint.

To use the `AuthenticationGuard`, you'll need to use the `@UseGuards` decorator:

```ts
import { Authentication } from "@nestjs-cognito/auth";
import { UseGuards } from "@nestjs/common";

@Controller("dogs")
@UseGuards(AuthenticationGuard)
export class DogsController {
  // Your routes here
}
```

<details>
<summary>
Examples of using authentication:
</summary>

```ts
import {
  Authentication,
  AuthenticationGuard,
  CognitoUser,
} from "@nestjs-cognito/auth";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

@Controller("dogs")
@Authentication()
export class DogsController {
  @Get()
  findAll(@CognitoUser("email") email: string): string {
    return "This action returns all my dogs";
  }
}

@Controller("cats")
@UseGuards(AuthenticationGuard)
export class CatsController {
  @Get()
  findAll(@CognitoUser(["groups", "email", "username"]) me): string {
    return "This action returns all my cats";
  }
}

@Controller("dogs")
export class DogsController {
  @Get()
  @Authentication()
  findAll(@CognitoUser() CognitoJwtPayload): string {
    return "This action returns all my dogs";
  }
}

@Controller("cats")
export class CatsController {
  @Get()
  @UseGuards(AuthenticationGuard)
  findAll(@CognitoUser(["groups", "email", "username"]) me): string {
    return "This action returns all my cats";
  }
}
```

</details>

### `Authorization`

#### `@Authorization` Decorator

The `@Authorization` decorator can be used to secure an entire controller. You can specify the `allowedGroups`, `requiredGroups`, and/or `prohibitedGroups` for a given controller.

For example:

```ts
@Controller("dogs")
@Authorization({
  allowedGroups: ["user", "admin"],
  requiredGroups: ["moderator"],
  prohibitedGroups: ["visitor"],
})
export class DogsController {
  @Get()
  findAll(@CognitoUser() CognitoJwtPayload): string {
    return "This action returns all my dogs";
  }
}
```

You can also specify the `allowedGroups` as an array of strings:

```ts
@Controller("cats")
@Authorization(["user"]) // allowedGroups by default
export class CatsController {
  @Get()
  findAll(@CognitoUser("username") username: string): string {
    return "This action returns all my cats";
  }
}
```

#### `AuthorizationGuard`

The `AuthorizationGuard` can be used to secure a single route, allowing you to specify the `allowedGroups`, `requiredGroups`, and/or `prohibitedGroups` for a given endpoint.

For example:

```ts
@Controller("cats")
@UseGuards(
  AuthorizationGuard({
    allowedGroups: ["user", "admin"],
    requiredGroups: ["moderator"],
    prohibitedGroups: ["visitor"],
  })
)
export class CatsController {
  @Get()
  findAll(@CognitoUser("email") email: string): string {
    return "This action returns all my cats";
  }
}
```

You can also use the `AuthorizationGuard` directly on a route:

```ts
@Controller("cats")
export class CatsController {
  @Get()
  @UseGuards(AuthorizationGuard(["user", "admin"]))
  findAll(@CognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my cats";
  }
}
```

<details>

<summary>
Examples of using authorization:
</summary>

```ts
import {
  Authorization,
  AuthorizationGuard,
  CognitoUser,
} from "@nestjs-cognito/auth";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

@Controller("dogs")
@Authorization({
  allowedGroups: ["user", "admin"],
  requiredGroups: ["moderator"],
  prohibitedGroups: ["visitor"],
})
export class DogsController {
  @Get()
  findAll(@CognitoUser() CognitoJwtPayload): string {
    return "This action returns all my dogs";
  }
}

@Controller("cats")
@Authorization(["user"]) // allowedGroups by default
export class CatsController {
  @Get()
  findAll(@CognitoUser("username") username: string): string {
    return "This action returns all my cats";
  }
}

@Controller("cats")
@UseGuards(
  AuthorizationGuard({
    allowedGroups: ["user", "admin"],
    requiredGroups: ["moderator"],
    prohibitedGroups: ["visitor"],
  })
)
export class CatsController {
  @Get()
  findAll(@CognitoUser("email") email: string): string {
    return "This action returns all my cats";
  }
}

@Controller("cats")
export class CatsController {
  @Get()
  @UseGuards(AuthorizationGuard(["user", "admin"]))
  findAll(@CognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my cats";
  }
}
```

</details>

### `@CognitoUser`

To retrieve the cognito user from an incoming request, you'll need to use the `@CognitoUser` decorator. You can use the decorator to inject the entire `CognitoJwtPayload` object or specific properties from the payload, such as the `username` or `email`. Note that the `cognito:` namespace is automatically managed, so you don't need to include it when accessing properties such as `cognito:username` or `cognito:groups`.

It's important to note that this decorator must be used in conjunction with an authentication guard, such as `Authentication` or `Authorization`.

For example:

```ts
@Controller()
@Authentication()
export class YourController {
  @Get()
  findAll(@CognitoUser() cognitoJwtPayload: CognitoJwtPayload): string {
    return "This action returns all the data";
  }
}
```

#### <b>Optional property name</b>

You can specify the name of the property to inject the user into by passing a string as an argument.

```ts
import { Authentication, CognitoUser } from "@nestjs-cognito/auth";

@Controller()
@Authentication()
export class YourController {
  @Get()
  getData(@CognitoUser("email") email: string): any {
    // Use the `email` string
  }
}
```

#### <b>Multiple properties</b>

You can extract multiple properties from the cognito user by passing an array of strings.

```ts
import { Authentication, CognitoUser } from "@nestjs-cognito/auth";

@Controller()
@Authentication()
export class YourController {
  @Get()
  getData(
    @CognitoUser(["groups", "email", "username"])
    {
      groups,
      email,
      username,
    }: {
      groups: string[];
      email: string;
      username: string;
    }
  ): any {
    // Use the `groups` and/or `username` and `email` strings
  }
}
```

## License

<b>@nestjs-cognito/auth</b> is [MIT licensed](LICENSE).

</details>

<details>
  <summary>
    <h1 align="center">@nestjs-cognito/graphql</h1>
  </summary>

## Description

This package is a complement to [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth) and adds GraphQL support for Amazon Cognito authentication and authorization. It does not expose a CognitoGraphqlModule.

This package includes a GraphQL middleware that provides the authenticated user information in the GraphQL context. The middleware checks the presence of an Authorization header in the request and verifies the token with `aws-jwt-verify`. If the token is valid, the middleware adds the user information to the context.

In addition to the middleware, this package also includes guards (`AuthenticationGuard` and `AuthorizationGuard`) and decorators (`GqlCognitoUser`, `GqlAuthentication` and `GqlAuthorization`) that can be used to restrict access to certain resolvers based on the user's authentication status or role.
It's recommended to use the decorators instead of guards coupled with `UseGuards` NestJS decorator.

## Installation

To install the library, use npm:

```bash
npm install @nestjs-cognito/graphql

```

## Usage

To use this package, you need to configure the [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth) module. Once the authentication module is configured, you can use the following exports from this package to handle Cognito authentication and authorization in your GraphQL resolvers.

### `@GqlAuthentication()`

This is a GraphQL middleware that provides the authenticated user information in the GraphQL context. The middleware checks the presence of a Authorization header in the request and verifies the token with Amazon Cognito. If the token is valid, the middleware adds the user information to the context.

```ts
import { GqlAuthentication } from "@nestjs-cognito/graphql";

@Resolver()
@GqlAuthentication()
export class MyResolver {
  @Query()
  public async myQuery() {
    // Only authenticated user can access this resolver
  }
}
```

<details>
<summary>
Examples of using authentication:
</summary>

```ts
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  GqlAuthentication,
  AuthenticationGuard,
  GqlCognitoUser,
} from "@nestjs-cognito/graphql";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

@Resolver("dogs")
@GqlAuthentication()
export class DogsResolver {
  @Query(() => String)
  findAll(@GqlCognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my dogs";
  }
}

@Resolver("cats")
@UseGuards(AuthenticationGuard)
export class CatsResolver {
  @Query(() => String)
  findAll(@GqlCognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my cats";
  }
}

@Resolver("dogs")
export class DogsResolver {
  @Query(() => String)
  @UseGuards(AuthenticationGuard)
  findAll(@GqlCognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my dogs";
  }
}
```

</details>

### `@GqlAuthorization()`

This is a decorator that can be used to enforce authorization rules in your GraphQL resolvers. The decorator takes a list of authorized groups and checks if the authenticated user is a member of any of the groups. If the user is not a member of any of the groups, an error is thrown.

```ts
import { GqlAuthorization } from "@nestjs-cognito/graphql";

@Resolver()
export class MyResolver {
  @Query()
  @GqlAuthorization(["group1", "group2"])
  public async myQuery() {
    // only users in group1 or group2 can access this resolver
  }
}
```

<details>
<summary>
Examples of using authorization:
</summary>

```ts
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  GqlAuthorization,
  AuthorizationGuard,
  GqlCognitoUser,
} from "@nestjs-cognito/graphql";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

@Resolver("dogs")
@GqlAuthorization({
  allowedGroups: ["user", "admin"],
  requiredGroups: ["moderator"],
  prohibitedGroups: ["visitor"],
})
export class DogsResolver {
  @Query(() => String)
  findAll(@GqlCognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my dogs";
  }
}

@Resolver("cats")
@GqlAuthorization(["user"]) // allowedGroups by default
export class CatsResolver {
  @Query(() => String)
  findAll(@GqlCognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my cats";
  }
}

@Resolver("cats")
@UseGuards(
  AuthorizationGuard({
    allowedGroups: ["user", "admin"],
    requiredGroups: ["moderator"],
    prohibitedGroups: ["visitor"],
  })
)
export class CatsResolver {
  @Query(() => String)
  findAll(@GqlCognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my cats";
  }
}

@Resolver("cats")
export class CatsResolver {
  @Query(() => String)
  @UseGuards(AuthorizationGuard(["user", "admin"]))
  findAll(@GqlCognitoUser() me: CognitoJwtPayload): string {
    return "This action returns all my cats";
  }
}
```

</details>

### `@GqlCognitoUser()`

This is a decorator that can be used in your GraphQL resolvers to access the authenticated user information from the context.

```ts
import { GqlCognitoUser } from "@nestjs-cognito/graphql";
import { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

@Resolver()
export class MyResolver {
  @Query()
  public async myQuery(@GqlCognitoUser() user: CognitoJwtPayload) {
    // user information from Cognito
  }
}
```

For a complete example of how to use these guards and decorators, you can check out the [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth) package.

## License

<b>@nestjs-cognito/graphql</b> is [MIT licensed](LICENSE).

</details>

<details>
  <summary>
    <h1 align="center">@nestjs-cognito/testing</h1>
  </summary>

## Description

This module is a solution for [NestJS](https://github.com/nestjs/nest) which facilitates the integration with [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) for end-to-end and integration testing purposes. It includes a module, a controller, and a service that simplify testing your authentication and authorization code based on [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html).

## Installation

```bash
npm install @nestjs-cognito/testing
```

## Usage

### Module

To use the `CognitoTestingModule`, you will need to import it and use either the `register` or `registerAsync` method to set up its dependencies:

```ts
@Module({
  imports: [
    CognitoTestingModule.register({
      identityProvider: {
        region: "eu-west-1",
      },
    }),
  ],
})
export class AppModule {}
```

### Controller

The `CognitoTestingController` is a simple controller that accepts a username and password and returns an access token. The code is shown below:

<details>
<summary>Controller Source Code</summary>

```ts
import { Body, Controller, Post } from "@nestjs/common";
import { CognitoTestingService } from "@nestjs-cognito/testing";

@Controller()
export class CognitoTestingController {
  constructor(private readonly authService: CognitoTestingService) {}

  @Post("cognito-testing-login")
  login(@Body() body: Record<string, string>) {
    return this.authService.getAccessToken(
      {
        username: body.username,
        password: body.password,
      },
      body.clientId
    );
  }
}
```

</details>

### Service

The `CognitoTestingService` is a service that uses the `CognitoIdentityProvider` client to get an access token. To call the method `cognito-testing-login`, you need to pass the following information in the request body:

- `username`: The username of the test user
- `password`: The password of the test user
- `clientId`: Required for using the initiateAuth method provided by `@aws-sdk/client-cognito-identity-provider`.

## Example using Jest and Pactum

```ts
import { CognitoTestingModule } from "@nestjs-cognito/testing";
import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { request, spec } from "pactum";

describe("Cognito Module : Testing", () => {
  let app: INestApplication;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CognitoTestingModule.register({
          region: "eu-west-1",
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    config = moduleFixture.get<ConfigService>(ConfigService);

    await app.listen(0);
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    request.setBaseUrl(url);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("authentication", () => {
    it("should be able to access the private route", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("COGNITO_USER_EMAIL"),
          password: config.get("COGNITO_USER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("AccessToken").
        .stores('token', 'AccessToken');
      await spec()
        .get('/private')
        .withHeaders('Authorization', 'Bearer $S{token}')
        .expectStatus(200);
    });
  });
});
```

## License

<b>@nestjs-cognito/testing</b> is [MIT licensed](LICENSE).

</details>

## License

<b>@nestjs-cognito</b> is [MIT licensed](LICENSE).
