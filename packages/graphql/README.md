<h1 align="center">@nestjs-cognito/graphql</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito-monorepo/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito-monorepo/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito-monorepo/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito-monorepo?branch=main)

## Description

GraphQL utilities module for [@nestjs-cognito/auth](../../packages/auth/README.md)

## Installation

```bash
npm i @nestjs-cognito/graphql
```

## Configuration

See [@nestjs-cognito/auth](../../packages/auth/README.md#configuration)

## Usage

You can use the built-in `@nestjs-cognito/graphql` decorators and guards.

### Built-in decorators and guards

- Decorate the resolver with the `@Authentication` decorator or with the `@UseGuards` decorator to apply the `AuthenticationGuard` to the resolver in order to ensure that the user is authenticated.
- Decorate the resolver with the `@Authorization` decorator or with the `@UseGuards` decorator to apply the `AuthorizationGuard` in order to ensure that the user is authorized.
- Decorate method arguments with the `@CurrentUser` decorator to get the current user.

<b>During the `authorization` process, we already check if the user is authenticated, so you don't need to use `authentication` guard or decorator.</b>

In addition, you can find more details about `@UseGuards` decorator [here](https://docs.nestjs.com/guards).

Here is an example that shows how to use authentication:

```ts
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  Authentication,
  AuthenticationGuard,
  CurrentUser,
} from "@nestjs-cognito/graphql";
import { User } from "@nestjs-cognito/auth";

@Resolver("dogs")
@Authentication()
export class DogsResolver {
  @Query(() => String)
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my dogs";
  }
}

@Resolver("cats")
@UseGuards(AuthenticationGuard)
export class CatsResolver {
  @Query(() => String)
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my cats";
  }
}

@Resolver("dogs")
export class DogsResolver {
  @Query(() => String)
  @UseGuards(AuthenticationGuard)
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my dogs";
  }
}
```

Here is an example that shows how to use authorization:

```ts
import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { User } from "@nestjs-cognito/auth";
import {
  Authorization,
  AuthorizationGuard,
  CurrentUser,
} from "@nestjs-cognito/graphql";

@Resolver("dogs")
@Authorization({
  allowedGroups: ["user", "admin"],
  requiredGroups: ["moderator"],
  prohibitedGroups: ["visitor"],
})
export class DogsResolver {
  @Query(() => String)
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my dogs";
  }
}

@Resolver("cats")
@Authorization(["user"]) // allowedGroups by default
export class CatsResolver {
  @Query(() => String)
  findAll(@CurrentUser() me: User): string {
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
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my cats";
  }
}

@Resolver("cats")
export class CatsResolver {
  @Query(() => String)
  @UseGuards(AuthorizationGuard(["user", "admin"]))
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my cats";
  }
}
```

## License

<b>@nestjs-cognito/graphql</b> is [MIT licensed](LICENSE).
