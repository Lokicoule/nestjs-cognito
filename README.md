<h1 align="center">@nestjs-cognito</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)

<details>
  <summary>
    <h1 align="right">@nestjs-cognito/core</h1>
  </summary>

## Description

This module is a simple wrapper on [AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html).

## Installation

```bash
npm i @nestjs-cognito/core
```

## Configuration

### Options params

```ts
/**
 * @interface CognitoModuleOptions - Options for the CognitoModule
 * @property {string} region - The region
 */
export type CognitoModuleOptions = CognitoIdentityProviderClientConfig &
  Required<Pick<CognitoIdentityProviderClientConfig, "region">>;

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
  useExisting?: Type<CognitoModuleOptionsFactory>;
  useClass?: Type<CognitoModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CognitoModuleOptions> | CognitoModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
```

### Synchronously

Use `CognitoModule.register` method with options of [CognitoModuleOptions interface](#options-params)

```ts
import { CognitoModule } from "@nestjs-cognito/core";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoModule.register({
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
import { CognitoModule } from "@nestjs-cognito/core";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CognitoModule.registerAsync({
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

You can use the cognito identity provider injectors.

### Cognito Identity Provider

```ts
import {
  InjectCognitoIdentityProvider,
  InjectCognitoIdentityProviderClient,
} from "nestjs-cognito";

export class MyService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    @InjectCognitoIdentityProviderClient()
    private readonly cognitoIdentityProviderClient: CognitoIdentityProviderClient
  ) {}
}
```

</details>

<details>
  <summary>
    <h1 align="right">@nestjs-cognito/auth</h1>
  </summary>

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
- Decorate the controller with the `@Authorization` decorator or with the `@UseGuards` decorator to apply the `AuthorizationGuard` in order to ensure that the user is authorized.
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

</details>
<details>
  <summary>
    <h1 align="right">@nestjs-cognito/graphql</h1>
  </summary>

## Description

GraphQL utilities module for [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth)

## Installation

```bash
npm i @nestjs-cognito/graphql
```

## Configuration

See [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth)

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

</details>
<details>
  <summary>
    <h1 align="right">@nestjs-cognito/testing</h1>
  </summary>

## Description

[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) utilities module for [Nest](https://github.com/nestjs/nest).
This module is intended for end-to-end and integration testing.

## Installation

```bash
npm i @nestjs-cognito/testing
```

## Usage

```ts
@Module({
  imports: [
    CognitoTestingModule.register({
      region: "eu-west-1",
    }),
  ],
})
export class AppModule {}
```

Now, you can call the method `cognito-testing-login` and pass to the body the following properties :

- username : The username of the test user
- password : The password of the test user
- clientId : Must be filled in order to use `initiateAuth` method exposed by @aws-sdk/client-cognito-identity-provider.

## Example with Jest and Pactum

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

</details>

## License

<b>@nestjs-cognito</b> is [MIT licensed](LICENSE).
