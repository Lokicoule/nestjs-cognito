---
"@nestjs-cognito/auth": patch
"@nestjs-cognito/core": patch
"@nestjs-cognito/graphql": patch
"@nestjs-cognito/testing": patch
---

## @nestjs-cognito/testing

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
