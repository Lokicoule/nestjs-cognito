# Changelog:

## 2.2.0

### Minor Changes

- 0d1e2f3: ## Features

  ### JWT Verification Improvements

  - Added support for ECDSA and EdDSA signing algorithms
  - Enhanced JWT verification through aws-jwt-verify v5
  - Maintained full backward compatibility with existing APIs
  - Improved token validation security

  ### Package Updates

  - Updated NestJS core dependencies to latest stable versions
  - Improved TypeScript type definitions and compatibility
  - Enhanced GraphQL integration and features
  - Optimized testing utilities and mock providers

  ## Dependencies

  ### Major Updates

  - aws-jwt-verify: v4 → v5
  - Jest: Updated to v30
  - GraphQL: Updated to v16.11.0
  - TypeScript ESLint: Updated to v8.34.0

  ### AWS SDK Updates

  - Updated AWS SDK core packages
  - Improved Cognito Identity Provider client
  - Enhanced AWS JWT verification utilities

  ### Development Dependencies

  - ESLint configuration improvements
  - Prettier formatting updates
  - Updated Node.js type definitions
  - Enhanced development tooling support

  ## Bug Fixes

  ### Core Functionality

  - Fixed NestJS monorepo integration issues
  - Resolved GraphQL compatibility concerns
  - Improved error handling in JWT verification
  - Enhanced type safety across all packages

## 2.0.1

### Patch Changes

- eb798d2: ## Package Updates

  ### @nestjs-cognito/auth

  - Updated `@nestjs/common` peer dependency to support multiple versions: `^8.0.0 || ^9.0.0 || ^10.0.0 || ^11.0.0`

  ### @nestjs-cognito/core

  - Updated `@aws-sdk/client-cognito-identity-provider` peer dependency from `3.744.0` to `^3.744.0`
  - Updated `@nestjs/common` peer dependency to support multiple versions: `^8.0.0 || ^9.0.0 || ^10.0.0 || ^11.0.0`

## 2.0.0

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
