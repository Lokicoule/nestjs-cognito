# @nestjs-cognito

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
[![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Fcore.svg)](https://badge.fury.io/js/%40nestjs-cognito%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

@nestjs-cognito is a powerful, type-safe library that provides seamless integration of AWS Cognito authentication into NestJS applications. Designed to simplify authentication workflows, this library offers a comprehensive solution for developers working with AWS Cognito and NestJS.

## ✨ Key Features

- 🔒 **Robust Authentication**: Seamless NestJS integration with AWS Cognito
- 🛡️ **Built-in Protection**: Advanced authentication guards and decorators
- 🌐 **GraphQL Support**: First-class support for GraphQL applications
- 🧪 **Testing Utilities**: Comprehensive testing tools for authentication flows
- 🔍 **Type Safety**: Fully typed implementation for enhanced developer experience
- ⚙️ **Flexible Configuration**: Easy synchronous and asynchronous module registration

## 📦 Package Structure

| Package | Description | Version |
|---------|-------------|---------|
| **@nestjs-cognito/core** | Core functionality and AWS Cognito integration | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Fcore.svg)](https://www.npmjs.com/package/@nestjs-cognito/core) |
| **@nestjs-cognito/auth** | Authentication module with guards and decorators | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Fauth.svg)](https://www.npmjs.com/package/@nestjs-cognito/auth) |
| **@nestjs-cognito/graphql** | GraphQL integration support | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Fgraphql.svg)](https://www.npmjs.com/package/@nestjs-cognito/graphql) |
| **@nestjs-cognito/testing** | E2E testing utilities for real-world Cognito authentication scenarios | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Ftesting.svg)](https://www.npmjs.com/package/@nestjs-cognito/testing) |

## 🛠️ Installation

Install the core packages with npm:

```bash
# Core and authentication modules
npm install @nestjs-cognito/core @nestjs-cognito/auth

# Optional: GraphQL support
npm install @nestjs-cognito/graphql

# Optional: Testing utilities (dev dependency)
npm install -D @nestjs-cognito/testing
```

## 📝 Usage Examples

### Basic Module Registration

```typescript
import { CognitoAuthModule } from '@nestjs-cognito/auth';

@Module({
  imports: [
    CognitoAuthModule.register({
      region: 'us-east-1',
      userPoolId: 'your-user-pool-id',
      clientId: 'your-client-id',
    }),
  ],
})
export class AppModule {}
```

### Async Configuration with ConfigService

```typescript
import { CognitoAuthModule } from '@nestjs-cognito/auth';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        region: configService.get('AWS_REGION'),
        userPoolId: configService.get('AWS_USER_POOL_ID'),
        clientId: configService.get('AWS_CLIENT_ID'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### GraphQL Integration

```typescript
import { GqlCognitoUser } from '@nestjs-cognito/graphql';

@Resolver()
export class UserResolver {
  @Query()
  async getProfile(@GqlCognitoUser() user) {
    return user;
  }
}
```

### E2E Testing Real-World Authentication Flows

The testing module provides comprehensive end-to-end (e2e) testing utilities to validate Cognito authentication behavior in real-world scenarios:

```typescript
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { Test } from '@nestjs/testing';

describe('Cognito Authentication E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        CognitoTestingModule.register({
          // Configure with actual AWS Cognito credentials
          region: process.env.AWS_REGION,
          userPoolId: process.env.AWS_USER_POOL_ID,
          clientId: process.env.AWS_CLIENT_ID,
        }),
        AppModule, // Your application module
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should perform real-world authentication flow', async () => {
    // Conduct end-to-end tests with actual Cognito service
    // Test user sign-up, sign-in, token validation, etc.
  });

  afterAll(async () => {
    await app.close();
  });
});
```

**Key Features of E2E Testing Module**:
- Validate actual Cognito authentication behaviors
- Test complete authentication flows against real AWS Cognito services
- Verify integration of Cognito with NestJS application
- Ensure proper token generation, validation, and authorization
- Simulate real-world authentication scenarios

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🔗 Resources

- [GitHub Repository](https://github.com/Lokicoule/nestjs-cognito)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
- [NestJS Documentation](https://docs.nestjs.com/)

## 📧 Contact

Project Link: [https://github.com/Lokicoule/nestjs-cognito](https://github.com/Lokicoule/nestjs-cognito)
