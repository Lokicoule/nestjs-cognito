<h1 align="center">@nestjs-cognito/graphql</h1>

## Description

[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) utilities module for [Nest](https://github.com/nestjs/nest) coupled with GraphQL.

## Installation

Peer dependencies :

- @nestjs/jwt
- @aws-sdk/client-cognito-identity-provider
- @nestjs-cognito/auth
- @nestjs-cognito/core

```bash
npm i @nestjs/jwt @aws-sdk/client-cognito-identity-provider @nestjs-cognito/auth @nestjs-cognito/core
```

```bash
npm i --save @nestjs-cognito/graphql
```

## Configuration

### Synchronously

Use `CognitoGraphQLModule.register` method with options of nestjs-cognito [CognitoModuleOptions interface](https://github.com/Lokicoule/nestjs-cognito#readme#options-params)

```ts
import { CognitoGraphQLModule } from "nestjs-cognito-graphql";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoGraphQLModule.register({
      region: "eu-west-X",
    }),
  ],
})
export class AppModule {}
```

### Asynchronously

With `CognitoGraphQLModule.registerAsync` you can import your ConfigModule and inject ConfigService to use it in `useFactory` method.
It's also possible to use `useExisting` or `useClass`.
You can find more details [here](https://docs.nestjs.com/techniques/configuration).

Here's an example:

```ts
import { CognitoGraphQLModule } from "nestjs-cognito";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CognitoGraphQLModule.registerAsync({
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

You can use the built-in `nestjs-cognito-graphql` decorators and guards.

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
} from "nestjs-cognito-graphql";
import { User } from "nestjs-cognito";

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
import { User } from "nestjs-cognito";
import {
  Authorization,
  AuthorizationGuard,
  CurrentUser,
} from "nestjs-cognito-graphql";

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

NestJS-Cognito-GraphQL is [MIT licensed](LICENSE).
