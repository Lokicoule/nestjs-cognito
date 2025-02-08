# Changelog:

## 3.0.1

### Patch Changes

- Updated dependencies [eb798d2]
  - @nestjs-cognito/auth@2.0.1

## 3.0.0

### Major Changes

- 93ae5bb: ## Major Infrastructure Changes

  - Upgraded to NestJS v11.0.0
  - Migrated from Lerna to PNPM workspace for improved monorepo management
  - Updated CI/CD workflows with PNPM-based configuration

  ## Breaking Changes

  - Updated peer dependencies to support NestJS v11
  - Updated all package dependencies to their latest compatible versions

  ## Package-specific Updates

  ### @nestjs-cognito/core

  - Updated dependencies to support NestJS v11

  ### @nestjs-cognito/auth

  - Updated dependencies to support NestJS v11

  ### @nestjs-cognito/graphql

  - Updated dependencies to support NestJS v11
  - Adapted GraphQL tests for compatibility with updated dependencies

  ### @nestjs-cognito/testing

  - Updated dependencies to support NestJS v11

### Patch Changes

- Updated dependencies [93ae5bb]
  - @nestjs-cognito/auth@2.0.0

## @nestjs-cognito/core:

- The code for importing and registering the CognitoAuthModule has changed.
- The old code:

```ts
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoAuthModule.register({
      region: region,
    }),
  ],
})
export class AppModule {}
```

- The new code:

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

## @nestjs-cognito/auth:

- Replaced "CurrentUser" with "CognitoUser".
- "CurrentUser" is now deprecated.

## @nestjs-cognito/graphql:

- Added the "Gql" prefix before all decorators.
- "Authentication" and "Authorization" decorators are now deprecated for the graphql module and have been replaced by "GqlAuthentication" and "GqlAuthorization".
- Replaced "CurrentUser" with "GqlCognitoUser".
- "CurrentUser" is now deprecated.
