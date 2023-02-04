<h1 align="center">@nestjs-cognito/graphql</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)

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
