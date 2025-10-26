<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header-graphql.svg?raw=true" alt="NestJS-Cognito GraphQL" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
![npm](https://img.shields.io/npm/dt/%40nestjs-cognito%2Fgraphql)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

`@nestjs-cognito/graphql` brings AWS Cognito authentication and authorization to your NestJS GraphQL APIs. This package extends [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth) with GraphQL-specific decorators and guards, providing seamless integration with Apollo Server and NestJS GraphQL.

The package provides GraphQL context integration for user information, specialized decorators for resolvers, and guards that work naturally with GraphQL execution context.

## Features

- **GraphQL Context Integration** - Automatic injection of authenticated user information into GraphQL context
- **Resolver Decorators** - GraphQL-specific `@GqlAuthentication()` and `@GqlAuthorization()` decorators
- **User Extraction** - `@GqlCognitoUser()`, `@GqlCognitoAccessUser()`, and `@GqlCognitoIdUser()` decorators for accessing user data
- **Authorization Guards** - Role-based access control with allowed, required, and prohibited groups
- **Type Safety** - Full TypeScript support with typed JWT payloads
- **Zero Configuration** - Works out-of-the-box with your existing `@nestjs-cognito/auth` setup

## Installation

```bash
npm install @nestjs-cognito/graphql @nestjs-cognito/auth
```

## Quick Start

### 1. Configure Authentication Module

First, set up the `@nestjs-cognito/auth` module as described in the [auth package documentation](https://www.npmjs.com/package/@nestjs-cognito/auth):

```typescript
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: "us-east-1_xxxxxx",
        clientId: "your-client-id",
        tokenUse: "access",
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Protect Your Resolvers

```typescript
import { GqlAuthentication, GqlCognitoUser } from "@nestjs-cognito/graphql";
import { Query, Resolver } from "@nestjs/graphql";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Resolver()
@GqlAuthentication()
export class UserResolver {
  @Query(() => String)
  getCurrentUser(@GqlCognitoUser() user: CognitoJwtPayload): string {
    return `Authenticated as ${user.username}`;
  }
}
```

### 3. Add Role-Based Authorization

```typescript
import { GqlAuthorization, GqlCognitoUser } from "@nestjs-cognito/graphql";
import { Mutation, Args, Resolver } from "@nestjs/graphql";

@Resolver()
export class AdminResolver {
  @Mutation(() => Boolean)
  @GqlAuthorization(["admin", "superadmin"])
  deleteUser(
    @Args("userId") userId: string,
    @GqlCognitoUser("username") username: string
  ): boolean {
    console.log(`User ${username} deleted user ${userId}`);
    return true;
  }
}
```

## Table of Contents

- [Authentication](#authentication)
  - [@GqlAuthentication Decorator](#gqlauthentication-decorator)
  - [AuthenticationGuard](#authenticationguard)
- [Authorization](#authorization)
  - [@GqlAuthorization Decorator](#gqlauthorization-decorator)
  - [AuthorizationGuard](#authorizationguard)
- [User Decorators](#user-decorators)
  - [@GqlCognitoUser - Generic Decorator](#gqlcognitouser---generic-decorator)
  - [@GqlCognitoAccessUser - Access Token Decorator](#gqlcognitoaccessuser---access-token-decorator)
  - [@GqlCognitoIdUser - ID Token Decorator](#gqlcognitoiduser---id-token-decorator)
- [Related Packages](#related-packages)
- [License](#license)

## Authentication

Protect your GraphQL resolvers by requiring valid AWS Cognito authentication tokens. The authentication middleware extracts the JWT from the Authorization header and adds user information to the GraphQL context.

> **Note:** When using authorization, authentication is already checked, so there's no need to use both decorators together.

### @GqlAuthentication Decorator

The `@GqlAuthentication()` decorator is the recommended approach for securing resolvers. It can be applied at the resolver or query/mutation level:

**Resolver-level authentication:**

```typescript
import { GqlAuthentication, GqlCognitoUser } from "@nestjs-cognito/graphql";
import { Query, Resolver } from "@nestjs/graphql";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Resolver("User")
@GqlAuthentication()
export class UserResolver {
  @Query(() => String)
  getProfile(@GqlCognitoUser() user: CognitoJwtPayload): string {
    return `Profile for ${user.email}`;
  }

  @Query(() => [String])
  getNotifications(@GqlCognitoUser("sub") userId: string): string[] {
    return [`Notification for user ${userId}`];
  }
}
```

**Query/Mutation-level authentication:**

```typescript
import { GqlAuthentication, GqlCognitoUser } from "@nestjs-cognito/graphql";
import { Query, Mutation, Args, Resolver } from "@nestjs/graphql";

@Resolver()
export class PostResolver {
  @Query(() => [String])
  getAllPosts(): string[] {
    return ["Public post 1", "Public post 2"];
  }

  @Mutation(() => String)
  @GqlAuthentication()
  createPost(
    @Args("title") title: string,
    @GqlCognitoUser("username") username: string
  ): string {
    return `Post "${title}" created by ${username}`;
  }
}
```

### AuthenticationGuard

Alternatively, you can use the `AuthenticationGuard` directly with `@UseGuards()`:

```typescript
import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { AuthenticationGuard, GqlCognitoUser } from "@nestjs-cognito/graphql";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Resolver("Profile")
@UseGuards(AuthenticationGuard)
export class ProfileResolver {
  @Query(() => String)
  getMyProfile(@GqlCognitoUser() user: CognitoJwtPayload): string {
    return `Profile for ${user.username}`;
  }
}
```

## Authorization

Implement role-based access control (RBAC) for your GraphQL API using Cognito user groups. Authorization automatically includes authentication verification.

### @GqlAuthorization Decorator

The `@GqlAuthorization()` decorator enforces group-based access control with three types of rules:

- **`allowedGroups`** - User must belong to at least one of these groups
- **`requiredGroups`** - User must belong to all of these groups
- **`prohibitedGroups`** - User must not belong to any of these groups

**Resolver-level authorization:**

```typescript
import { GqlAuthorization, GqlCognitoUser } from "@nestjs-cognito/graphql";
import { Query, Mutation, Args, Resolver } from "@nestjs/graphql";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Resolver("Admin")
@GqlAuthorization({
  allowedGroups: ["admin", "superadmin"],
  prohibitedGroups: ["suspended"],
})
export class AdminResolver {
  @Query(() => [String])
  getAllUsers(@GqlCognitoUser() admin: CognitoJwtPayload): string[] {
    return ["user1", "user2", "user3"];
  }

  @Mutation(() => Boolean)
  @GqlAuthorization({ requiredGroups: ["superadmin"] })
  deleteAllData(): boolean {
    return true;
  }
}
```

**Simplified syntax for allowed groups:**

```typescript
@Resolver("Content")
@GqlAuthorization(["editor", "admin"]) // shorthand for allowedGroups
export class ContentResolver {
  @Mutation(() => String)
  publishArticle(@Args("id") id: string): string {
    return `Article ${id} published`;
  }
}
```

**Mutation-level authorization:**

```typescript
@Resolver("Comment")
export class CommentResolver {
  @Query(() => [String])
  getComments(): string[] {
    return ["Comment 1", "Comment 2"];
  }

  @Mutation(() => Boolean)
  @GqlAuthorization(["moderator", "admin"])
  deleteComment(@Args("id") id: string): boolean {
    return true;
  }
}
```

### AuthorizationGuard

You can also use the `AuthorizationGuard` directly with `@UseGuards()`:

```typescript
import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { AuthorizationGuard, GqlCognitoUser } from "@nestjs-cognito/graphql";

@Resolver("Reports")
@UseGuards(
  AuthorizationGuard({
    allowedGroups: ["analyst", "manager"],
    prohibitedGroups: ["guest"],
  })
)
export class ReportsResolver {
  @Query(() => String)
  getFinancialReport(@GqlCognitoUser("email") email: string): string {
    return `Report for ${email}`;
  }
}
```

## User Decorators

Extract authenticated user information from JWT tokens in your GraphQL resolvers using specialized decorators. All decorators must be used within resolvers protected by authentication or authorization.

### @GqlCognitoUser - Generic Decorator

The `@GqlCognitoUser()` decorator works with both access and ID tokens, providing flexible access to user information from the GraphQL context.

**Inject the complete payload:**

```typescript
import { GqlAuthentication, GqlCognitoUser } from "@nestjs-cognito/graphql";
import { Query, Resolver } from "@nestjs/graphql";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Resolver()
@GqlAuthentication()
export class ProfileResolver {
  @Query(() => String)
  getProfile(@GqlCognitoUser() user: CognitoJwtPayload): string {
    return JSON.stringify({
      username: user.username,
      email: user.email,
      sub: user.sub,
    });
  }
}
```

**Extract a single property:**

```typescript
@Resolver()
@GqlAuthentication()
export class UserResolver {
  @Query(() => String)
  getEmail(@GqlCognitoUser("email") email: string): string {
    return email;
  }
}
```

**Extract multiple properties:**

```typescript
@Resolver()
@GqlAuthentication()
export class UserResolver {
  @Query(() => String)
  getUserInfo(
    @GqlCognitoUser(["email", "username", "groups"])
    user: {
      email: string;
      username: string;
      groups: string[];
    }
  ): string {
    return `${user.username} (${user.email}) - Groups: ${user.groups.join(", ")}`;
  }
}
```

> **Note:** The `cognito:` namespace is automatically managed for properties like `cognito:groups` and `cognito:username`. You can reference them without the prefix.

### @GqlCognitoAccessUser - Access Token Decorator

The `@GqlCognitoAccessUser()` decorator validates that the token is an access token and provides access to access token-specific properties. It throws `CognitoTokenTypeMismatchError` if an ID token is provided.

**When to use:** When you need access token properties like `scope` and `client_id`, or want to enforce that only access tokens are accepted.

```typescript
import { GqlAuthentication, GqlCognitoAccessUser } from "@nestjs-cognito/graphql";
import { Query, Resolver } from "@nestjs/graphql";
import type { CognitoAccessTokenPayload } from "@nestjs-cognito/core";

@Resolver()
@GqlAuthentication()
export class ApiResolver {
  @Query(() => String)
  getTokenInfo(@GqlCognitoAccessUser() token: CognitoAccessTokenPayload): string {
    return JSON.stringify({
      scope: token.scope,
      clientId: token.client_id,
      username: token.username,
    });
  }
}
```

### @GqlCognitoIdUser - ID Token Decorator

The `@GqlCognitoIdUser()` decorator validates that the token is an ID token and provides access to ID token-specific properties. It throws `CognitoTokenTypeMismatchError` if an access token is provided.

**When to use:** When you need ID token properties like `email`, `cognito:groups`, or custom attributes, or want to enforce that only ID tokens are accepted.

```typescript
import { GqlAuthentication, GqlCognitoIdUser } from "@nestjs-cognito/graphql";
import { Query, Resolver } from "@nestjs/graphql";
import type { CognitoIdTokenPayload } from "@nestjs-cognito/core";

@Resolver()
@GqlAuthentication()
export class UserResolver {
  @Query(() => String)
  getUserDetails(@GqlCognitoIdUser() user: CognitoIdTokenPayload): string {
    return JSON.stringify({
      username: user["cognito:username"],
      email: user.email,
      groups: user["cognito:groups"],
      emailVerified: user.email_verified,
    });
  }
}
```

**Choosing the right decorator:**

- **`@GqlCognitoAccessUser`** - Use when you need `scope`, `client_id`, or want to enforce access tokens
- **`@GqlCognitoIdUser`** - Use when you need `email`, `cognito:groups`, custom attributes, or want to enforce ID tokens
- **`@GqlCognitoUser`** - Use when you don't care about token type or need to support both

## Complete Example

Here's a complete example showing authentication, authorization, and user extraction in a GraphQL API:

```typescript
import {
  GqlAuthentication,
  GqlAuthorization,
  GqlCognitoUser,
} from "@nestjs-cognito/graphql";
import { Query, Mutation, Args, Resolver } from "@nestjs/graphql";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Resolver("Article")
export class ArticleResolver {
  // Public query - no authentication required
  @Query(() => [String])
  getPublicArticles(): string[] {
    return ["Public article 1", "Public article 2"];
  }

  // Authenticated query - requires valid token
  @Query(() => [String])
  @GqlAuthentication()
  getMyArticles(@GqlCognitoUser("sub") userId: string): string[] {
    return [`Article by user ${userId}`];
  }

  // Authorized mutation - requires specific groups
  @Mutation(() => String)
  @GqlAuthorization(["editor", "admin"])
  createArticle(
    @Args("title") title: string,
    @GqlCognitoUser() user: CognitoJwtPayload
  ): string {
    return `Article "${title}" created by ${user.username}`;
  }

  // Restricted mutation - requires admin role
  @Mutation(() => Boolean)
  @GqlAuthorization(["admin"])
  deleteArticle(@Args("id") id: string): boolean {
    return true;
  }
}
```

## Related Packages

- **[@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth)** - Core authentication module (required)
- **[@nestjs-cognito/core](https://www.npmjs.com/package/@nestjs-cognito/core)** - Core functionality and AWS Cognito integration
- **[@nestjs-cognito/testing](https://www.npmjs.com/package/@nestjs-cognito/testing)** - Testing utilities for E2E and mock testing

## Resources

- [Documentation](https://lokicoule.github.io/nestjs-cognito/)
- [GitHub Repository](https://github.com/Lokicoule/nestjs-cognito)
- [NestJS GraphQL Documentation](https://docs.nestjs.com/graphql/quick-start)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)

## License

**@nestjs-cognito/graphql** is [MIT licensed](LICENSE).
