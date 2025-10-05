---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/core": minor
"@nestjs-cognito/graphql": minor
---

# Specialized Cognito User Decorators with Type Safety

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
