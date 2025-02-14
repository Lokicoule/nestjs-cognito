<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header-core.svg?raw=true" alt="NestJS-Cognito Core" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
![npm](https://img.shields.io/npm/dt/%40nestjs-cognito%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>



This package provides the core functionality and adapters for AWS Cognito integration in NestJS applications. It serves as the foundation for other @nestjs-cognito packages.

## Key Features

- Core adapters and interfaces for AWS Cognito integration
- JWT verification capabilities
- Cognito Identity Provider integration
- Dependency injection tokens and decorators

## Installation

```bash
npm install @nestjs-cognito/core
```

## Package Architecture

The Core package provides essential adapters and interfaces that are used by other packages in the @nestjs-cognito ecosystem:

- **CognitoJwtVerifier**: An adapter for verifying JWT tokens issued by AWS Cognito
- **CognitoIdentityProvider**: Integration with AWS Cognito Identity Provider service
- **Dependency Injection Tokens**: Tokens for proper dependency injection in NestJS applications

## Usage

### Cognito Identity Provider

```ts
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { InjectCognitoIdentityProvider } from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider
  ) {}
}
```

### JWT Verification

The package provides two mutually exclusive JWT verification implementations that share the same injection token. The implementation you get depends on your module configuration:

#### JWT Claims Verification

Both implementations perform comprehensive JWT claims verification according to AWS Cognito standards:

- **Expiration Check**: Verifies the `exp` claim to ensure the token hasn't expired
- **Audience Validation**: 
  - For ID tokens: Validates the `aud` claim matches the app's client ID
  - For Access tokens: Validates the `client_id` claim matches the app's client ID
- **Issuer Verification**: Validates the `iss` claim matches your Cognito User Pool's issuer URL format:
  `https://cognito-idp.[REGION].amazonaws.com/[USER_POOL_ID]`
- **Token Use Verification**: Validates the `token_use` claim:
  - Must be `access` for access tokens
  - Must be `id` for ID tokens
  - Can be set to `null` to accept both token types

#### Cognito JWT Verification

When you configure `jwtVerifier` in your module, this implementation is used to verify JWTs issued by AWS Cognito:

```ts
import {
  CognitoJwtVerifier,
  InjectCognitoJwtVerifier
} from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier: CognitoJwtVerifier
  ) {}

  async verifyToken(token: string) {
    return this.jwtVerifier.verify(token);
  }
}
```

#### RSA JWT Verification

When you configure `jwtRsaVerifier` in your module, this implementation is used to verify JWTs using RSA public keys:

```ts
import {
  JwtRsaVerifier,
  InjectCognitoJwtVerifier
} from "@nestjs-cognito/core";

export class MyService {
  constructor(
    @InjectCognitoJwtVerifier()
    private readonly jwtVerifier: JwtRsaVerifier
  ) {}

  async verifyToken(token: string) {
    return this.jwtVerifier.verify(token);
  }
}
```

> **Important**: While both verifier types use the same `@InjectCognitoJwtVerifier()` decorator, they are mutually exclusive in configuration. The type of verifier you get (CognitoJwtVerifier or JwtRsaVerifier) is determined by which configuration option you use in your module:
> - Use `jwtVerifier` for Cognito JWT verification
> - Use `jwtRsaVerifier` for RSA JWT verification
> 
> You cannot configure both types simultaneously in the same module.

> **Note**: Choose either Cognito JWT Verification or RSA JWT Verification based on your authentication requirements. The `InjectCognitoJwtVerifier` decorator works with both verifier types, but you should configure only one type in your module.

### Module Configuration

```ts
import { CognitoModule } from '@nestjs-cognito/core';

@Module({
  imports: [
    CognitoModule.register({
      // Required: Configure AWS Cognito Identity Provider
      identityProvider: {
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'xxxxx',
          secretAccessKey: 'xxxxx',
        },
      },

      // Choose ONE of the following JWT verification methods:
      
      // Option 1A: Configure Cognito JWT verification (Single User Pool)
      jwtVerifier: {
        userPoolId: 'us-east-1_xxxxx',
        clientId: 'xxxxx',
        tokenUse: 'access', // 'access', 'id', or null to accept both
        // Optional: Configure JWK cache
        additionalProperties: {
          jwksCache: {
            // Cache configuration
            expiryTimeInHours: 24
          }
        }
      },

      // Option 1B: Configure Cognito JWT verification (Multiple User Pools)
      jwtVerifier: [
        {
          userPoolId: 'us-east-1_pool1',
          clientId: 'client1',
          tokenUse: 'access' // 'access', 'id', or null to accept both
        },
        {
          userPoolId: 'us-east-1_pool2',
          clientId: 'client2',
          tokenUse: 'id',
          additionalProperties: {
            jwksCache: {
              expiryTimeInHours: 24
            }
          }
        }
      ],
      
      // Option 2A: Configure RSA JWT verification (Single Issuer)
      jwtRsaVerifier: {
        issuer: 'https://your-issuer.com',
        jwksUri: 'https://your-jwks-uri.com/.well-known/jwks.json',
        // Optional: Configure JWK cache
        additionalProperties: {
          jwksCache: {
            expiryTimeInHours: 24
          }
        }
      },

      // Option 2B: Configure RSA JWT verification (Multiple Issuers)
      jwtRsaVerifier: [
        {
          issuer: 'https://issuer1.com',
          jwksUri: 'https://issuer1.com/.well-known/jwks.json'
        },
        {
          issuer: 'https://issuer2.com',
          jwksUri: 'https://issuer2.com/.well-known/jwks.json',
          additionalProperties: {
            jwksCache: {
              expiryTimeInHours: 24
            }
          }
        }
      ]
    }),
  ],
})
export class AppModule {}
```

> **Note**: When using multiple user pools or issuers, you can configure each one independently with its own settings, including separate JWK cache configurations. The verifier will automatically handle token verification against all configured sources.

## Integration with @nestjs-cognito/auth

The Core package provides the foundational adapters and interfaces that are utilized by the Auth package for implementing authentication and authorization features:

- The Auth package uses the `CognitoJwtVerifier` adapter for token verification
- It leverages the `CognitoIdentityProvider` for user management operations
- Utilizes the dependency injection tokens for proper integration

For authentication features, it's recommended to use the @nestjs-cognito/auth package which builds upon these core components.

## License

MIT
