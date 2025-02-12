# @nestjs-cognito/testing

Comprehensive testing utilities for NestJS applications using AWS Cognito authentication.

## Features

- 🔄 Real E2E testing with AWS Cognito services
- 🎭 Mock testing capabilities for development
- 🛠️ Test helpers for authentication flows
- 🎯 Custom test decorators and utilities
- 🔌 Seamless integration with @nestjs-cognito/auth

## Installation

```bash
npm install @nestjs-cognito/testing
```

## Architecture Overview

The testing module consists of three main components:

### 1. CognitoTestingController
Handles HTTP endpoints for test configuration and authentication:
- `/cognito-testing-login` - Endpoint for test user authentication
- `/config` - Endpoint for updating mock configuration

### 2. CognitoTestingService
Manages authentication flows and token handling:
- Real AWS Cognito authentication
- Mock authentication configuration
- Token verification

### 3. CognitoMockService
Provides mock authentication capabilities:
- JWT token generation
- Mock user management
- Token verification

## Usage

### Real E2E Testing

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoTestingModule } from '@nestjs-cognito/testing';
import { CognitoAuthModule } from '@nestjs-cognito/auth';

@Module({
  imports: [
    CognitoAuthModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (config: ConfigService) => ({
        jwtVerifier: {
          userPoolId: config.get('COGNITO_USER_POOL_ID'),
          clientId: config.get('COGNITO_CLIENT_ID'),
          tokenUse: 'id',
        },
      }),
      inject: [ConfigService],
    }),
    CognitoTestingModule.registerAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (config: ConfigService) => ({
        identityProvider: {
          region: config.get('COGNITO_REGION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TestModule {}

// Example test case using real AWS Cognito
describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let cognitoTestingService: CognitoTestingService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    cognitoTestingService = moduleFixture.get<CognitoTestingService>(CognitoTestingService);
    await app.init();
  });

  it('should authenticate with real Cognito', async () => {
    const token = await cognitoTestingService.getAccessToken({
      username: 'test@example.com',
      password: 'TestPassword123!',
    }, 'your-client-id');

    expect(token).toBeDefined();
    // Test protected routes with the token
  });
});
```

### Mock Testing

```typescript
import { CognitoTestingModule } from '@nestjs-cognito/testing';

describe('Auth Tests', () => {
  let app: INestApplication;
  let cognitoTestingService: CognitoTestingService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CognitoTestingModule.register({}, {
          enabled: true,
          user: {
            username: 'test-user',
            email: 'test@example.com',
            groups: ['users'],
          },
        }),
        AppModule,
      ],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useFactory({
        factory: CognitoTestingModule.createJwtVerifierFactory
      })
      .compile();

    app = moduleFixture.createNestApplication();
    cognitoTestingService = moduleFixture.get<CognitoTestingService>(CognitoTestingService);
    await app.init();
  });

  it('should validate mock authentication', async () => {
    // Test authentication using mock service
    const response = await request(app.getHttpServer())
      .post('/cognito-testing-login')
      .send({
        username: 'test-user',
        password: 'any-password', // Password is not validated in mock mode
        clientId: 'mock-client-id'
      })
      .expect(200);

    // Test protected routes
    await request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${response.body.AccessToken}`)
      .expect(200)
      .expect({
        username: 'test-user',
        email: 'test@example.com',
        groups: ['users'],
      });
  });
});
```

### Dynamic Configuration

Update mock settings during test execution:

```typescript
await request(app.getHttpServer())
  .post('/config')
  .send({
    user: {
      username: 'new-user',
      email: 'new@example.com',
      groups: ['admin'],
    },
  })
  .expect(200);
```

## API Reference

### CognitoTestingService

#### getAccessToken(credentials, clientId)
- `credentials`: User credentials (username, password)
- `clientId`: Cognito client ID
- Returns: Promise with authentication tokens

#### setMockConfig(config)
- `config`: Mock configuration object
- Updates the mock testing configuration

#### verifyToken(token)
- `token`: JWT token string
- Verifies token authenticity

### CognitoTestingModule

#### register(options?, mockOptions?)
- `options`: AWS Cognito configuration
- `mockOptions`: Mock testing configuration
  - `enabled`: Enable/disable mock mode
  - `user`: Mock user configuration

#### registerAsync(options)
- Asynchronous module configuration
- Supports dependency injection

## License

<b>@nestjs-cognito/testing</b> is [MIT licensed](LICENSE).
