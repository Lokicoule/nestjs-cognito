---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/core": minor
"@nestjs-cognito/graphql": minor
"@nestjs-cognito/testing": minor
---

## Features

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
