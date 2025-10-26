<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header-auth.svg?raw=true" alt="NestJS-Cognito Auth" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
![npm](https://img.shields.io/npm/dt/%40nestjs-cognito%2Fauth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

`@nestjs-cognito/auth` is a powerful authentication and authorization library for NestJS applications using AWS Cognito. Built on top of [@nestjs-cognito/core](https://www.npmjs.com/package/@nestjs-cognito/core) and [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify), it provides type-safe decorators and guards to secure your REST APIs with minimal configuration.

## Features

- **JWT Token Verification** - Automatic verification of AWS Cognito access and ID tokens
- **Authentication Guards** - Simple `@Authentication()` decorator for protecting routes
- **Role-Based Authorization** - Fine-grained access control with `@Authorization()` decorator supporting allowed, required, and prohibited groups
- **User Decorators** - Extract user information from tokens with `@CognitoUser()`, `@CognitoAccessUser()`, and `@CognitoIdUser()` decorators
- **Public Routes** - `@PublicRoute()` decorator for optional authentication with security enforcement
- **Type Safety** - Full TypeScript support with typed payloads
- **Flexible Configuration** - Both synchronous and asynchronous module configuration
- **Zero Boilerplate** - Minimal setup required to secure your application

## Installation

```bash
npm install @nestjs-cognito/auth
```

## Quick Start

### 1. Configure the Module

```typescript
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: "us-east-1_xxxxxx",
        clientId: "your-client-id",
        tokenUse: "access", // or "id"
      },
    }),
  ],
})
export class AppModule {}
```

### 2. Protect Your Routes

```typescript
import { Authentication, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Controller("profile")
@Authentication()
export class ProfileController {
  @Get()
  getProfile(@CognitoUser() user: CognitoJwtPayload) {
    return { username: user.username, email: user.email };
  }
}
```

### 3. Add Role-Based Authorization

```typescript
import { Authorization, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Delete } from "@nestjs/common";

@Controller("admin")
@Authorization(["admin", "superadmin"])
export class AdminController {
  @Delete("users/:id")
  deleteUser(@CognitoUser("username") username: string) {
    return `Action performed by ${username}`;
  }
}
```

## Table of Contents

- [Configuration](#configuration)
  - [Synchronous Configuration](#synchronous-configuration)
  - [Asynchronous Configuration](#asynchronous-configuration)
- [Authentication](#authentication)
  - [@Authentication Decorator](#authentication-decorator)
  - [AuthenticationGuard](#authenticationguard)
- [Authorization](#authorization)
  - [@Authorization Decorator](#authorization-decorator)
  - [AuthorizationGuard](#authorizationguard)
- [User Decorators](#user-decorators)
  - [@CognitoUser - Generic Decorator](#cognitouser---generic-decorator)
  - [@CognitoAccessUser - Access Token Decorator](#cognitoaccessuser---access-token-decorator)
  - [@CognitoIdUser - ID Token Decorator](#cognitoiduser---id-token-decorator)
- [Public Routes](#public-routes)
- [Related Packages](#related-packages)
- [License](#license)

## Configuration

The `@nestjs-cognito/auth` library offers both synchronous and asynchronous configuration options. You need to provide your AWS Cognito user pool ID and client ID. For detailed information about available options, see the [@nestjs-cognito/core documentation](https://www.npmjs.com/package/@nestjs-cognito/core).

### Synchronous Configuration

Use the `CognitoAuthModule.register()` method to configure the module with static options:

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

**Configuration Options:**

- `jwtVerifier.userPoolId` - Your AWS Cognito user pool ID
- `jwtVerifier.clientId` - Your AWS Cognito app client ID
- `jwtVerifier.tokenUse` - Token type: `"access"` or `"id"` (AWS Cognito supports access token customization since December 2023, making it the recommended choice for RBAC)

> **Note:** You can define an identity provider without importing the separate [CognitoModule](https://www.npmjs.com/package/@nestjs-cognito/core) by using `CognitoAuthModule`.

### Asynchronous Configuration

Use `CognitoAuthModule.registerAsync()` to configure the module with dynamic options from ConfigService or other providers:

```typescript
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        jwtVerifier: {
          userPoolId: configService.get("COGNITO_USER_POOL_ID") as string,
          clientId: configService.get("COGNITO_CLIENT_ID") as string,
          tokenUse: "access",
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

You can also use `useExisting` or `useClass` for configuration. See the [NestJS documentation](https://docs.nestjs.com/techniques/configuration) for more information about asynchronous configuration patterns.

## Authentication

Protect your routes by requiring valid AWS Cognito authentication tokens. You can use either the `@Authentication()` decorator or the `AuthenticationGuard` with `@UseGuards()`.

> **Note:** When using authorization, authentication is already checked, so there's no need to use both guards together.

### @Authentication Decorator

The `@Authentication()` decorator is the recommended approach for securing controllers or individual routes:

```typescript
import { Authentication, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Controller("dogs")
@Authentication()
export class DogsController {
  @Get()
  findAll(@CognitoUser("email") email: string): string {
    return `This action returns all dogs for ${email}`;
  }
}
```

You can also apply the decorator to individual routes:

```typescript
@Controller("dogs")
export class DogsController {
  @Get()
  @Authentication()
  findAll(@CognitoUser() user: CognitoJwtPayload): string {
    return "This action returns all my dogs";
  }
}
```

### AuthenticationGuard

Alternatively, use the `AuthenticationGuard` directly with the `@UseGuards()` decorator:

```typescript
import { AuthenticationGuard, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Get, UseGuards } from "@nestjs/common";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Controller("cats")
@UseGuards(AuthenticationGuard)
export class CatsController {
  @Get()
  findAll(@CognitoUser(["email", "username"]) user): string {
    return "This action returns all my cats";
  }
}
```

## Authorization

Implement role-based access control (RBAC) using Cognito user groups. Authorization automatically includes authentication, so you don't need both guards.

### @Authorization Decorator

The `@Authorization()` decorator enforces group-based access control with three types of rules:

- **`allowedGroups`** - User must belong to at least one of these groups
- **`requiredGroups`** - User must belong to all of these groups
- **`prohibitedGroups`** - User must not belong to any of these groups

**Controller-level authorization:**

```typescript
import { Authorization, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Controller("admin")
@Authorization({
  allowedGroups: ["admin", "superadmin"],
  requiredGroups: ["verified"],
  prohibitedGroups: ["suspended"],
})
export class AdminController {
  @Get()
  getDashboard(@CognitoUser() user: CognitoJwtPayload): string {
    return "Admin dashboard";
  }
}
```

**Simplified syntax for allowed groups:**

```typescript
@Controller("users")
@Authorization(["user", "admin"]) // shorthand for allowedGroups
export class UsersController {
  @Get()
  findAll(@CognitoUser("username") username: string): string {
    return "This action returns all users";
  }
}
```

**Route-level authorization:**

```typescript
@Controller("posts")
export class PostsController {
  @Delete(":id")
  @Authorization(["moderator", "admin"])
  deletePost(@CognitoUser() user: CognitoJwtPayload): string {
    return "Post deleted";
  }
}
```

### AuthorizationGuard

You can also use the `AuthorizationGuard` directly with `@UseGuards()`:

```typescript
import { AuthorizationGuard, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Get, UseGuards } from "@nestjs/common";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Controller("reports")
@UseGuards(
  AuthorizationGuard({
    allowedGroups: ["analyst", "manager"],
    prohibitedGroups: ["guest"],
  })
)
export class ReportsController {
  @Get()
  getReports(@CognitoUser("email") email: string): string {
    return "Financial reports";
  }
}
```

**Route-level with guard:**

```typescript
@Controller("settings")
export class SettingsController {
  @Get()
  @UseGuards(AuthorizationGuard(["admin", "superadmin"]))
  getSettings(@CognitoUser() user: CognitoJwtPayload): string {
    return "System settings";
  }
}
```

## User Decorators

Extract authenticated user information from JWT tokens using specialized decorators. All decorators must be used within routes protected by authentication or authorization guards.

### @CognitoUser - Generic Decorator

The `@CognitoUser()` decorator works with both access and ID tokens, providing flexible access to user information.

**Inject the complete payload:**

```typescript
import { Authentication, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Controller("profile")
@Authentication()
export class ProfileController {
  @Get()
  getProfile(@CognitoUser() user: CognitoJwtPayload) {
    return {
      username: user.username,
      email: user.email,
      sub: user.sub,
    };
  }
}
```

**Extract a single property:**

```typescript
@Controller("profile")
@Authentication()
export class ProfileController {
  @Get("email")
  getEmail(@CognitoUser("email") email: string): string {
    return email;
  }
}
```

**Extract multiple properties:**

```typescript
@Controller("profile")
@Authentication()
export class ProfileController {
  @Get("info")
  getInfo(
    @CognitoUser(["email", "username", "groups"])
    user: {
      email: string;
      username: string;
      groups: string[];
    }
  ) {
    return user;
  }
}
```

> **Note:** The `cognito:` namespace is automatically managed for properties like `cognito:groups` and `cognito:username`. You can reference them without the prefix.

### @CognitoAccessUser - Access Token Decorator

The `@CognitoAccessUser()` decorator validates that the token is an access token and provides access to access token-specific properties like `scope` and `client_id`. It throws `CognitoTokenTypeMismatchError` if an ID token is provided.

**When to use:** When you need access token properties or want to enforce that only access tokens are accepted.

```typescript
import { Authentication, CognitoAccessUser } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import type { CognitoAccessTokenPayload } from "@nestjs-cognito/core";

@Controller("api")
@Authentication()
export class ApiController {
  @Get("scope")
  getScope(@CognitoAccessUser() token: CognitoAccessTokenPayload) {
    return {
      scope: token.scope,
      clientId: token.client_id,
      username: token.username,
    };
  }
}
```

### @CognitoIdUser - ID Token Decorator

The `@CognitoIdUser()` decorator validates that the token is an ID token and provides access to ID token-specific properties like `email`, `cognito:groups`, and custom attributes. It throws `CognitoTokenTypeMismatchError` if an access token is provided.

**When to use:** When you need ID token properties like email, groups, or custom attributes, or want to enforce that only ID tokens are accepted.

```typescript
import { Authentication, CognitoIdUser } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import type { CognitoIdTokenPayload } from "@nestjs-cognito/core";

@Controller("user")
@Authentication()
export class UserController {
  @Get("details")
  getUserDetails(@CognitoIdUser() user: CognitoIdTokenPayload) {
    return {
      username: user["cognito:username"],
      email: user.email,
      groups: user["cognito:groups"],
      emailVerified: user.email_verified,
    };
  }
}
```

**Choosing the right decorator:**

- **`@CognitoAccessUser`** - Use when you need `scope`, `client_id`, or want to enforce access tokens
- **`@CognitoIdUser`** - Use when you need `email`, `cognito:groups`, custom attributes, or want to enforce ID tokens
- **`@CognitoUser`** - Use when you don't care about token type or need to support both

## Public Routes

The `@PublicRoute()` decorator makes routes accessible without authentication while still enforcing validation when credentials are provided. This is perfect for implementing "login to see more" features.

### How It Works

- **Without authentication token:** Route is accessible, user parameter will be `undefined`
- **With valid token:** Route is accessible and user information is available
- **With invalid token:** Returns 401 Unauthorized (security is never compromised)

### Basic Example

```typescript
import { Authentication, PublicRoute, CognitoUser } from "@nestjs-cognito/auth";
import { Controller, Get } from "@nestjs/common";
import type { CognitoJwtPayload } from "@nestjs-cognito/core";

@Controller("api")
@Authentication() // All routes require auth by default
export class ApiController {
  @Get("welcome")
  @PublicRoute()
  welcomeUser(@CognitoUser() user?: CognitoJwtPayload) {
    if (user) {
      return `Welcome back, ${user.username}!`;
    }
    return "Hello! Login to see your personalized dashboard.";
  }
}
```

### Real-World Example

```typescript
@Controller("products")
export class ProductsController {
  @Get(":id")
  @PublicRoute()
  getProduct(
    @Param("id") id: string,
    @CognitoUser() user?: CognitoJwtPayload
  ) {
    const product = this.productsService.findById(id);

    return {
      ...product,
      // Show member pricing if authenticated
      price: user
        ? this.getPricingService.getMemberPrice(product)
        : product.regularPrice,
      // Additional data for authenticated users
      memberDetails: user
        ? {
            inWishlist: this.wishlistService.contains(user.sub, id),
            availableStock: this.inventoryService.getStock(id),
            memberReviews: this.reviewsService.getMemberReviews(id),
          }
        : null,
    };
  }
}
```

### When to Use

- Public pages with enhanced features for authenticated users
- Landing pages with personalization opportunities
- Preview content that expands with authentication
- Hybrid public/private APIs where authentication is optional but must be valid when provided

## Related Packages

- **[@nestjs-cognito/core](https://www.npmjs.com/package/@nestjs-cognito/core)** - Core functionality and AWS Cognito integration
- **[@nestjs-cognito/graphql](https://www.npmjs.com/package/@nestjs-cognito/graphql)** - GraphQL support for Cognito authentication
- **[@nestjs-cognito/testing](https://www.npmjs.com/package/@nestjs-cognito/testing)** - Testing utilities for E2E and mock testing

## Resources

- [Documentation](https://lokicoule.github.io/nestjs-cognito/)
- [GitHub Repository](https://github.com/Lokicoule/nestjs-cognito)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
- [NestJS Guards Documentation](https://docs.nestjs.com/guards)

## License

**@nestjs-cognito/auth** is [MIT licensed](LICENSE).
