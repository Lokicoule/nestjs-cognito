# @nestjs-cognito/core

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

### AWS JWT Verify

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
}
```

### Module Configuration

```ts
import { CognitoModule } from '@nestjs-cognito/core';

@Module({
  imports: [
    CognitoModule.register({
      // Configure both JWT verification and Identity Provider
      jwtVerifier: {
        userPoolId: 'us-east-1_xxxxx',
        clientId: 'xxxxx',
      },
      identityProvider: {
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'xxxxx',
          secretAccessKey: 'xxxxx',
        },
      },
    }),
  ],
})
export class AppModule {}
```

## Integration with @nestjs-cognito/auth

The Core package provides the foundational adapters and interfaces that are utilized by the Auth package for implementing authentication and authorization features:

- The Auth package uses the `CognitoJwtVerifier` adapter for token verification
- It leverages the `CognitoIdentityProvider` for user management operations
- Utilizes the dependency injection tokens for proper integration

For authentication features, it's recommended to use the @nestjs-cognito/auth package which builds upon these core components.

## License

MIT
