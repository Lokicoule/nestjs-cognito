# Changelog:

## 2.4.1

### Patch Changes

- 9e63910: ## @nestjs-cognito/testing

  **Fixed:** Critical DI resolution failure in test environment

  **Context:** Breaking change introduced in v2.4.0 added `COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN` as third dependency to `AbstractGuard`, but `CognitoTestingModule` provider graph was incomplete.

  **Root Cause:** Missing provider binding caused NestJS DI container to throw `UnknownDependenciesException` at module initialization.

  **Solution:**
  - Registered `COGNITO_JWT_EXTRACTOR_INSTANCE_TOKEN` provider with `BearerJwtExtractor` implementation
  - Added token to module exports in both sync (`register`) and async (`registerAsync`) initialization paths
  - Ensures test environment matches production DI graph topology

  **Impact:** Restores compatibility with @nestjs-cognito/auth ≥2.4.0

  ## @nestjs-cognito/auth

  **Improved:** Developer experience through documentation refinement
  - Streamlined onboarding flow with clearer setup instructions
  - Added practical usage patterns and anti-patterns
  - Reduced cognitive load in authentication configuration examples

  **Updated:** Relaxed peer dependency constraints for broader ecosystem compatibility

  ## @nestjs-cognito/core

  **Updated:** AWS SDK client to v3.930.0
  - Inherits upstream security patches and performance improvements
  - Maintains API stability

  **Improved:** Technical documentation quality
  - Enhanced JWT verification configuration clarity
  - Added architecture decision records for token extraction patterns
  - Improved setup guide with real-world integration examples

  ## @nestjs-cognito/graphql

  **Updated:** GraphQL stack dependencies
  - `@apollo/server`: 5.0.0 → 5.1.0 (performance improvements, bug fixes)
  - `graphql`: 16.11.0 → 16.12.0 (upstream stability improvements)

  **Improved:** Resolver documentation
  - Clarified runtime validation behavior for user decorators
  - Added type safety best practices
  - Enhanced error handling patterns

  ## All Packages

  **Maintenance:**
  - Bumped dev dependencies to latest stable releases
  - Enhanced npm package discoverability through improved metadata
  - Optimized search ranking through strategic keyword placement

## 2.4.0

### Minor Changes

- b067256: # Specialized Cognito User Decorators with Type Safety

  Add specialized decorators for Cognito token types with runtime validation, providing better type safety and developer experience when working with AWS Cognito JWT tokens.

  ## New Features

  ### Core Package (@nestjs-cognito/core)
  - Export `CognitoAccessTokenPayload` and `CognitoIdTokenPayload` types
  - Add `isAccessTokenPayload()` and `isIdTokenPayload()` type guards for runtime token type checking

  ### Auth Package (@nestjs-cognito/auth)
  - Add `@CognitoAccessUser` decorator for access tokens with type safety
  - Add `@CognitoIdUser` decorator for ID tokens with type safety
  - Add `CognitoTokenTypeMismatchError` for token type validation errors
  - Refactor decorator logic using shared `createCognitoUserDecorator()` factory
  - Existing `@CognitoUser` decorator remains unchanged (works with both token types)

  ### GraphQL Package (@nestjs-cognito/graphql)
  - Add `@GqlCognitoAccessUser` decorator for GraphQL resolvers (access tokens)
  - Add `@GqlCognitoIdUser` decorator for GraphQL resolvers (ID tokens)
  - Existing `@GqlCognitoUser` decorator remains unchanged

  ## Usage Examples

  **REST Controller with Access Token:**

  ```typescript
  import { CognitoAccessUser } from '@nestjs-cognito/auth';
  import type { CognitoAccessTokenPayload } from '@nestjs-cognito/core';

  @Get('scope')
  @Authentication()
  getScope(@CognitoAccessUser() token: CognitoAccessTokenPayload) {
    return { scope: token.scope };
  }
  ```

  **REST Controller with ID Token:**

  ```typescript
  import { CognitoIdUser } from '@nestjs-cognito/auth';
  import type { CognitoIdTokenPayload } from '@nestjs-cognito/core';

  @Get('profile')
  @Authentication()
  getProfile(@CognitoIdUser() user: CognitoIdTokenPayload) {
    return {
      email: user.email,
      groups: user['cognito:groups']
    };
  }
  ```

  **GraphQL Resolver:**

  ```typescript
  import { GqlCognitoIdUser } from '@nestjs-cognito/graphql';
  import type { CognitoIdTokenPayload } from '@nestjs-cognito/core';

  @Query()
  @GqlAuthentication()
  me(@GqlCognitoIdUser() user: CognitoIdTokenPayload) {
    return user;
  }
  ```

  ## Runtime Validation

  The specialized decorators validate token types at runtime and throw `CognitoTokenTypeMismatchError` when the token type doesn't match:

  ```typescript
  // Using @CognitoIdUser with an access token will throw:
  // CognitoTokenTypeMismatchError: Expected id token but received access token
  ```

  ## Breaking Changes

  None - this is a purely additive change. All existing decorators continue to work as before.

## 2.3.0

### Minor Changes

- 80cec2f: ## Features
  - Add configurable JWT token extraction with `CognitoJwtExtractor` interface
  - Add `BearerJwtExtractor` and `CookieJwtExtractor` implementations
  - Add `jwtExtractor` option to `CognitoModuleOptions`
  - Add `@InjectCognitoJwtExtractor()` decorator

  ## Fixes
  - Update @apollo/server to v5
  - Fix GitHub Actions workflow pnpm configuration

  ## Chores
  - Update TypeScript ESLint to v8.43.0
  - Update Node.js setup action to v5
  - Update upload-pages-artifact action to v4
  - Update checkout action to v5
  - Update Node.js to v22
  - Update pnpm to v9.15.9
  - Update various dependencies

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
