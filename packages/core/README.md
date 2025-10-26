<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header-core.svg?raw=true" alt="NestJS-Cognito Core" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
![npm](https://img.shields.io/npm/dt/%40nestjs-cognito%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

The core package provides essential AWS Cognito integration functionality for NestJS applications. It serves as the foundation for the @nestjs-cognito ecosystem, offering JWT verification, token extraction, and Cognito Identity Provider integration with comprehensive dependency injection support.

## Features

- **JWT Verification** - Cognito JWT and RSA-based token verification with JWKS caching
- **Token Extraction** - Flexible token extraction from headers, cookies, or custom sources
- **AWS Integration** - Native AWS Cognito Identity Provider SDK integration
- **Type Safety** - Full TypeScript support with comprehensive type definitions
- **Multi-Pool Support** - Handle multiple Cognito User Pools and issuers
- **Dependency Injection** - First-class NestJS DI support with decorators

## Installation

```bash
npm install @nestjs-cognito/core
```

## Quick Start

### Basic Configuration

```typescript
import { Module } from '@nestjs/common';
import { CognitoModule } from '@nestjs-cognito/core';

@Module({
  imports: [
    CognitoModule.register({
      jwtVerifier: {
        userPoolId: 'us-east-1_xxxxx',
        clientId: 'your-client-id',
        tokenUse: 'access', // 'access' | 'id' | null
      },
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoModule } from '@nestjs-cognito/core';

@Module({
  imports: [
    CognitoModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        jwtVerifier: {
          userPoolId: config.get('COGNITO_USER_POOL_ID'),
          clientId: config.get('COGNITO_CLIENT_ID'),
          tokenUse: 'access',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Core Components

### JWT Verification

The package provides two JWT verification strategies. Both perform comprehensive token validation including expiration, audience, issuer, and token use verification.

#### Cognito JWT Verifier

Verifies tokens issued by AWS Cognito User Pools using [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify):

```typescript
import {
  CognitoJwtVerifier,
  InjectCognitoJwtVerifier
} from '@nestjs-cognito/core';

export class AuthService {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier: CognitoJwtVerifier,
  ) {}

  async validateToken(token: string) {
    try {
      const payload = await this.jwtVerifier.verify(token);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}
```

**Configuration:**

```typescript
// Single User Pool
CognitoModule.register({
  jwtVerifier: {
    userPoolId: 'us-east-1_xxxxx',
    clientId: 'your-client-id',
    tokenUse: 'access', // 'access', 'id', or null for both
  },
})

// Multiple User Pools
CognitoModule.register({
  jwtVerifier: [
    {
      userPoolId: 'us-east-1_pool1',
      clientId: 'client1',
      tokenUse: 'access',
    },
    {
      userPoolId: 'us-east-1_pool2',
      clientId: 'client2',
      tokenUse: 'id',
    },
  ],
})
```

#### RSA JWT Verifier

Verifies JWTs using RSA public keys from any JWKS endpoint:

```typescript
import {
  JwtRsaVerifier,
  InjectCognitoJwtVerifier
} from '@nestjs-cognito/core';

export class AuthService {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier: JwtRsaVerifier,
  ) {}

  async validateToken(token: string) {
    const payload = await this.jwtVerifier.verify(token);
    return payload;
  }
}
```

**Configuration:**

```typescript
// Single Issuer
CognitoModule.register({
  jwtRsaVerifier: {
    issuer: 'https://your-issuer.com',
    jwksUri: 'https://your-issuer.com/.well-known/jwks.json',
  },
})

// Multiple Issuers
CognitoModule.register({
  jwtRsaVerifier: [
    {
      issuer: 'https://issuer1.com',
      jwksUri: 'https://issuer1.com/.well-known/jwks.json',
    },
    {
      issuer: 'https://issuer2.com',
      jwksUri: 'https://issuer2.com/.well-known/jwks.json',
    },
  ],
})
```

> **Note:** `InjectCognitoJwtVerifier()` works with both verifier types, but you must configure only one type (`jwtVerifier` or `jwtRsaVerifier`) in your module.

#### JWT Claims Verification

Both verifiers perform the following validations:

- **Expiration (`exp`)** - Ensures the token hasn't expired
- **Audience (`aud`/`client_id`)** - Validates the token's intended recipient
- **Issuer (`iss`)** - Verifies the token was issued by the expected authority
- **Token Use (`token_use`)** - Confirms the token type (access/id)

### Token Extraction

Flexible JWT token extraction from various sources.

#### Built-in Extractors

**Bearer Token (Default):**

```typescript
import { BearerJwtExtractor } from '@nestjs-cognito/core';

CognitoModule.register({
  jwtExtractor: new BearerJwtExtractor(), // Optional, this is the default
  // ... other config
})
```

Extracts tokens from: `Authorization: Bearer <token>`

**Cookie-Based:**

```typescript
import { CookieJwtExtractor } from '@nestjs-cognito/core';

CognitoModule.register({
  jwtExtractor: new CookieJwtExtractor('access_token'), // cookie name
  // ... other config
})
```

**Using in Services:**

```typescript
import {
  CognitoJwtExtractor,
  InjectCognitoJwtExtractor,
} from '@nestjs-cognito/core';

export class AuthService {
  constructor(
    @InjectCognitoJwtExtractor()
    private readonly jwtExtractor: CognitoJwtExtractor,
  ) {}

  extractToken(request: any): string | null {
    if (this.jwtExtractor.hasAuthenticationInfo(request)) {
      return this.jwtExtractor.getAuthorizationToken(request);
    }
    return null;
  }
}
```

#### Custom Extractors

Create custom token extractors by implementing the `CognitoJwtExtractor` interface:

```typescript
import { CognitoJwtExtractor } from '@nestjs-cognito/core';

export class CustomHeaderExtractor implements CognitoJwtExtractor {
  hasAuthenticationInfo(request: any): boolean {
    return Boolean(request.headers['x-custom-auth']);
  }

  getAuthorizationToken(request: any): string | null {
    const header = request.headers['x-custom-auth'];
    if (!header) return null;

    // Extract token from custom format
    const match = header.match(/^Token (.+)$/);
    return match ? match[1] : null;
  }
}

// Register in module
CognitoModule.register({
  jwtExtractor: new CustomHeaderExtractor(),
  // ... other config
})
```

### AWS Cognito Identity Provider

Direct access to AWS Cognito Identity Provider for user management operations:

```typescript
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { InjectCognitoIdentityProvider } from '@nestjs-cognito/core';

export class UserService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly cognito: CognitoIdentityProvider,
  ) {}

  async getUserInfo(username: string) {
    const response = await this.cognito.adminGetUser({
      UserPoolId: 'us-east-1_xxxxx',
      Username: username,
    });
    return response;
  }

  async listUsers(limit = 10) {
    const response = await this.cognito.listUsers({
      UserPoolId: 'us-east-1_xxxxx',
      Limit: limit,
    });
    return response.Users;
  }
}
```

**Configuration with Identity Provider:**

```typescript
CognitoModule.register({
  identityProvider: {
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
  jwtVerifier: {
    userPoolId: 'us-east-1_xxxxx',
    clientId: 'your-client-id',
    tokenUse: 'access',
  },
})
```

## Advanced Configuration

### JWK Cache Configuration

Configure JWKS key caching for improved performance:

```typescript
CognitoModule.register({
  jwtVerifier: {
    userPoolId: 'us-east-1_xxxxx',
    clientId: 'your-client-id',
    tokenUse: 'access',
    additionalProperties: {
      jwksCache: {
        expiryTimeInHours: 24, // Cache duration
      },
    },
  },
})
```

### Multi-Pool Configuration with Individual Settings

```typescript
CognitoModule.register({
  jwtVerifier: [
    {
      userPoolId: 'us-east-1_pool1',
      clientId: 'client1',
      tokenUse: 'access',
      additionalProperties: {
        jwksCache: {
          expiryTimeInHours: 24,
        },
      },
    },
    {
      userPoolId: 'eu-west-1_pool2',
      clientId: 'client2',
      tokenUse: 'id',
      additionalProperties: {
        jwksCache: {
          expiryTimeInHours: 12,
        },
      },
    },
  ],
})
```

### Cookie-Based Authentication

```typescript
CognitoModule.register({
  jwtExtractor: new CookieJwtExtractor('jwt_token'),
  jwtVerifier: {
    userPoolId: 'us-east-1_xxxxx',
    clientId: 'your-client-id',
    tokenUse: 'id',
  },
})
```

## Complete Configuration Example

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoModule, CookieJwtExtractor } from '@nestjs-cognito/core';

@Module({
  imports: [
    CognitoModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        // AWS Cognito Identity Provider configuration
        identityProvider: {
          region: config.get('AWS_REGION'),
          credentials: {
            accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
          },
        },

        // JWT token extraction strategy
        jwtExtractor: new CookieJwtExtractor('access_token'),

        // JWT verification configuration
        jwtVerifier: {
          userPoolId: config.get('COGNITO_USER_POOL_ID'),
          clientId: config.get('COGNITO_CLIENT_ID'),
          tokenUse: 'access',
          additionalProperties: {
            jwksCache: {
              expiryTimeInHours: 24,
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Integration with Other Packages

The Core package provides the foundational components used by:

- [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth) - Authentication guards and decorators
- [@nestjs-cognito/graphql](https://www.npmjs.com/package/@nestjs-cognito/graphql) - GraphQL authentication support
- [@nestjs-cognito/testing](https://www.npmjs.com/package/@nestjs-cognito/testing) - Testing utilities

For full authentication features (guards, decorators, authorization), use the [@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth) package.

## Documentation

For comprehensive guides, examples, and API reference visit the [official documentation](https://lokicoule.github.io/nestjs-cognito/).

## License

**@nestjs-cognito/core** is [MIT licensed](LICENSE).
