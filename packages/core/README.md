<h1 align="center">@NestJS-Cognito/Core</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)

## Description

[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) utilities module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
npm i --save @nestjs/jwt nestjs-cognito
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
import { CognitoModule } from "nestjs-cognito";
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
import { CognitoModule } from "nestjs-cognito";
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

## License

NestJS-Cognito is [MIT licensed](LICENSE).
