# Change Log

## 2.2.0

### Minor Changes

- 3d51573: ## Features

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

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.2.0 (2022-09-28)

### Bug Fixes

- **build:** unpack specs ([f550985](https://github.com/Lokicoule/nestjs-cognito/commit/f550985acb9687551bc78a5af815b23c51bea186))
- clean up ([2779725](https://github.com/Lokicoule/nestjs-cognito/commit/2779725f11ceabae373a8f75481871204c226ce9))
- **testing:** export ([84e6b90](https://github.com/Lokicoule/nestjs-cognito/commit/84e6b90d1b4ecf07bb9642e840992dd11f5271e2))

### Features

- **testing:** rename components and implement the module ([62bbb9e](https://github.com/Lokicoule/nestjs-cognito/commit/62bbb9ed74bc180fb9449852d54c4d091ea7b70a))

## 0.0.4-alpha.0 (2022-07-22)

## 0.0.3-alpha.0 (2022-07-22)

## 0.0.2-alpha.0 (2022-07-22)

### Features

- **@nestjs-cognito:** monorepo ([b521f8e](https://github.com/Lokicoule/nestjs-cognito/commit/b521f8e1eaaf169edb99b35ab61a7a3870235396))
