<h1 align="center">@nestjs-cognito/auth</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito-monorepo/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito-monorepo?branch=main)

## Description

[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) utilities module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
npm i @nestjs-cognito/auth
```

## Configuration

### Options params

You can find more details [here](https://www.npmjs.com/package/@nestjs-cognito/core).

### Synchronously

Use `CognitoAuthModule.register` method with options of [CognitoModuleOptions interface](https://www.npmjs.com/package/@nestjs-cognito/core)

```ts
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoAuthModule.register({
      region: "eu-west-X",
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
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get("COGNITO_REGION"),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Usage

You can use the built-in `@nestjs-cognito/auth` decorators and guards.

### Built-in decorators and guards

- Decorate the controller with the `@Authentication` decorator or with the `@UseGuards` decorator to apply the `AuthenticationGuard` to the controller in order to ensure that the user is authenticated.
- Decorate the resolver with the `@Authorization` decorator or with the `@UseGuards` decorator to apply the `AuthorizationGuard` in order to ensure that the user is authorized.
- Decorate method arguments with the `@CurrentUser` decorator to get the current user.

<b>During the `authorization` process, we already check if the user is authenticated, so you don't need to use `authentication` guard or decorator.</b>

In addition, you can find more details about `@UseGuards` decorator [here](https://docs.nestjs.com/guards).

Here is an example that shows how to use authentication:

```ts
import {
  Authentication,
  AuthenticationGuard,
  CurrentUser,
} from "@nestjs-cognito/auth";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("dogs")
@Authentication()
export class DogsController {
  @Get()
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my dogs";
  }
}

@Controller("cats")
@UseGuards(AuthenticationGuard)
export class CatsController {
  @Get()
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my cats";
  }
}

@Controller("dogs")
export class DogsController {
  @Get()
  @UseGuards(AuthenticationGuard)
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my dogs";
  }
}
```

Here is an example that shows how to use authorization:

```ts
import {
  Authorization,
  AuthorizationGuard,
  CurrentUser,
} from "@nestjs-cognito/auth";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("dogs")
@Authorization({
  allowedGroups: ["user", "admin"],
  requiredGroups: ["moderator"],
  prohibitedGroups: ["visitor"],
})
export class DogsController {
  @Get()
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my dogs";
  }
}

@Controller("cats")
@Authorization(["user"]) // allowedGroups by default
export class CatsController {
  @Get()
  findAll(@CurrentUser() me: User): string {
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
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my cats";
  }
}

@Controller("cats")
export class CatsController {
  @Get()
  @UseGuards(AuthorizationGuard(["user", "admin"]))
  findAll(@CurrentUser() me: User): string {
    return "This action returns all my cats";
  }
}
```

## License

<b>@nestjs-cognito/auth</b> is [MIT licensed](LICENSE).
