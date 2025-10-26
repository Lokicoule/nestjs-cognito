<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header-testing.svg?raw=true" alt="NestJS-Cognito Testing" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
![npm](https://img.shields.io/npm/dt/%40nestjs-cognito%2Ftesting)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

`@nestjs-cognito/testing` provides comprehensive testing utilities for NestJS applications using AWS Cognito authentication. It offers both real AWS Cognito integration for E2E tests and mock authentication capabilities for unit and integration tests, making it easy to test your authentication and authorization logic.

## Features

- **Real E2E Testing** - Authenticate against actual AWS Cognito services for realistic testing
- **Mock Authentication** - Generate mock JWT tokens for unit and integration tests without AWS connectivity
- **Test Helpers** - Convenient methods for obtaining access and ID tokens
- **Dynamic Configuration** - Update mock configuration at runtime during tests
- **JWT Verifier Override** - Seamless integration with existing `@nestjs-cognito/auth` module
- **Type Safety** - Full TypeScript support with typed test utilities

## Installation

```bash
npm install -D @nestjs-cognito/testing
```

## Quick Start

### Mock Testing (Recommended for Unit/Integration Tests)

```typescript
import { Test } from "@nestjs/testing";
import { CognitoTestingModule } from "@nestjs-cognito/testing";
import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { AppModule } from "../src/app.module";

describe("Auth Tests", () => {
  let app;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CognitoTestingModule.register(
          {},
          {
            enabled: true,
            user: {
              username: "test-user",
              email: "test@example.com",
              groups: ["users"],
            },
          }
        ),
        AppModule,
      ],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useFactory({
        factory: CognitoTestingModule.createJwtVerifierFactory,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("should authenticate with mock token", async () => {
    const response = await request(app.getHttpServer())
      .post("/cognito-testing-login")
      .send({
        username: "test-user",
        password: "any-password",
        clientId: "mock-client-id",
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });
});
```

### Real E2E Testing

```typescript
import { Test } from "@nestjs/testing";
import { CognitoTestingModule, CognitoTestingService } from "@nestjs-cognito/testing";
import { CognitoAuthModule } from "@nestjs-cognito/auth";

describe("Auth E2E Tests", () => {
  let cognitoTestingService: CognitoTestingService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CognitoAuthModule.register({
          jwtVerifier: {
            userPoolId: process.env.COGNITO_USER_POOL_ID,
            clientId: process.env.COGNITO_CLIENT_ID,
            tokenUse: "access",
          },
        }),
        CognitoTestingModule.register({
          identityProvider: {
            region: process.env.COGNITO_REGION,
          },
        }),
      ],
    }).compile();

    cognitoTestingService = moduleFixture.get(CognitoTestingService);
  });

  it("should authenticate with real Cognito", async () => {
    const token = await cognitoTestingService.getAccessToken(
      {
        username: "test@example.com",
        password: "TestPassword123!",
      },
      "your-client-id"
    );

    expect(token).toBeDefined();
  });
});
```

## Table of Contents

- [Architecture](#architecture)
- [Mock Testing](#mock-testing)
  - [Basic Setup](#basic-setup)
  - [JWT Verifier Override](#jwt-verifier-override)
  - [Runtime Configuration](#runtime-configuration)
- [Real E2E Testing](#real-e2e-testing)
  - [Synchronous Configuration](#synchronous-configuration)
  - [Asynchronous Configuration](#asynchronous-configuration)
- [API Reference](#api-reference)
  - [CognitoTestingModule](#cognitotestingmodule)
  - [CognitoTestingService](#cognitotestingservice)
  - [CognitoMockService](#cognitomockservice)
- [Testing Patterns](#testing-patterns)
- [Related Packages](#related-packages)
- [License](#license)

## Architecture

The testing module consists of three main components:

### CognitoTestingController

Provides HTTP endpoints for test configuration and authentication:

- **`POST /cognito-testing-login`** - Authenticate test users (both real and mock)
- **`POST /config`** - Update mock configuration during tests

### CognitoTestingService

Manages authentication flows and token handling:

- Real AWS Cognito authentication
- Mock authentication delegation
- Token retrieval and verification

### CognitoMockService

Provides mock authentication capabilities:

- JWT token generation
- Mock user management
- Token verification without AWS

## Mock Testing

Mock testing allows you to test authentication flows without connecting to AWS Cognito, making your tests faster and more reliable.

> **Important:** When using mock testing with `CognitoAuthModule` or `CognitoCoreModule`, you MUST override the JWT verifier provider to ensure proper mock functionality.

### Basic Setup

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { CognitoTestingModule } from "@nestjs-cognito/testing";
import { COGNITO_JWT_VERIFIER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { AppModule } from "../src/app.module";
import * as request from "supertest";

describe("Authentication (Mock)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CognitoTestingModule.register(
          {},
          {
            enabled: true,
            user: {
              username: "john.doe",
              email: "john@example.com",
              sub: "123e4567-e89b-12d3-a456-426614174000",
              groups: ["users", "editors"],
            },
          }
        ),
        AppModule,
      ],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useFactory({
        factory: CognitoTestingModule.createJwtVerifierFactory,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should authenticate with mock credentials", async () => {
    const response = await request(app.getHttpServer())
      .post("/cognito-testing-login")
      .send({
        username: "john.doe",
        password: "any-password", // Password is not validated in mock mode
        clientId: "mock-client-id",
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  it("should access protected route with mock token", async () => {
    const loginResponse = await request(app.getHttpServer())
      .post("/cognito-testing-login")
      .send({
        username: "john.doe",
        password: "any-password",
        clientId: "mock-client-id",
      });

    const response = await request(app.getHttpServer())
      .get("/protected-route")
      .set("Authorization", `Bearer ${loginResponse.body.token}`)
      .expect(200);

    expect(response.body.username).toBe("john.doe");
  });
});
```

### JWT Verifier Override

The JWT verifier override is essential for mock testing. Without it, your application will attempt to verify tokens against real AWS Cognito:

```typescript
const moduleFixture = await Test.createTestingModule({
  imports: [
    CognitoTestingModule.register({}, { enabled: true, user: mockUser }),
    AppModule,
  ],
})
  .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
  .useFactory({
    factory: CognitoTestingModule.createJwtVerifierFactory,
  })
  .compile();
```

### Runtime Configuration

You can update the mock user configuration during tests:

```typescript
import { CognitoTestingService } from "@nestjs-cognito/testing";

describe("Dynamic User Tests", () => {
  let cognitoTestingService: CognitoTestingService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CognitoTestingModule.register({}, { enabled: true, user: defaultUser }),
        AppModule,
      ],
    })
      .overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
      .useFactory({
        factory: CognitoTestingModule.createJwtVerifierFactory,
      })
      .compile();

    cognitoTestingService = moduleFixture.get(CognitoTestingService);
  });

  it("should update mock user at runtime", async () => {
    // Update the mock user configuration
    await cognitoTestingService.setMockConfig({
      enabled: true,
      user: {
        username: "admin-user",
        email: "admin@example.com",
        groups: ["admin", "superadmin"],
      },
    });

    // Test with new configuration
    const response = await request(app.getHttpServer())
      .post("/cognito-testing-login")
      .send({
        username: "admin-user",
        password: "any-password",
        clientId: "mock-client-id",
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });
});
```

## Real E2E Testing

Real E2E testing authenticates against actual AWS Cognito services, providing the most realistic test environment.

### Synchronous Configuration

```typescript
import { Test } from "@nestjs/testing";
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { CognitoTestingModule, CognitoTestingService } from "@nestjs-cognito/testing";

describe("Real Cognito E2E", () => {
  let cognitoTestingService: CognitoTestingService;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        CognitoAuthModule.register({
          jwtVerifier: {
            userPoolId: "us-east-1_xxxxxx",
            clientId: "your-client-id",
            tokenUse: "access",
          },
        }),
        CognitoTestingModule.register({
          identityProvider: {
            region: "us-east-1",
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    cognitoTestingService = moduleFixture.get(CognitoTestingService);
    await app.init();
  });

  it("should get access token from real Cognito", async () => {
    const accessToken = await cognitoTestingService.getAccessToken(
      {
        username: "test@example.com",
        password: "TestPassword123!",
      },
      "your-client-id"
    );

    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe("string");
  });

  it("should access protected route with real token", async () => {
    const accessToken = await cognitoTestingService.getAccessToken(
      {
        username: "test@example.com",
        password: "TestPassword123!",
      },
      "your-client-id"
    );

    const response = await request(app.getHttpServer())
      .get("/protected-route")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
```

### Asynchronous Configuration

```typescript
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { CognitoTestingModule } from "@nestjs-cognito/testing";

describe("Real Cognito E2E (Async)", () => {
  let cognitoTestingService: CognitoTestingService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CognitoAuthModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
            jwtVerifier: {
              userPoolId: config.get("COGNITO_USER_POOL_ID"),
              clientId: config.get("COGNITO_CLIENT_ID"),
              tokenUse: "access",
            },
          }),
          inject: [ConfigService],
        }),
        CognitoTestingModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
            identityProvider: {
              region: config.get("COGNITO_REGION"),
            },
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    cognitoTestingService = moduleFixture.get(CognitoTestingService);
  });

  it("should authenticate with environment configuration", async () => {
    const token = await cognitoTestingService.getAccessToken(
      {
        username: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      },
      process.env.COGNITO_CLIENT_ID
    );

    expect(token).toBeDefined();
  });
});
```

## API Reference

### CognitoTestingModule

The main module for configuring testing utilities.

**Static Methods:**

**`register(identityProviderOptions?, mockOptions?)`**

Synchronously register the testing module.

```typescript
CognitoTestingModule.register(
  {
    identityProvider: {
      region: "us-east-1",
    },
  },
  {
    enabled: true,
    user: {
      username: "test-user",
      email: "test@example.com",
      groups: ["users"],
    },
  }
);
```

**Parameters:**

- `identityProviderOptions` - AWS Cognito configuration for real E2E testing
  - `region` - AWS region (e.g., "us-east-1")
- `mockOptions` - Mock testing configuration
  - `enabled` - Enable mock mode
  - `user` - Mock user properties (username, email, sub, groups, etc.)

**`registerAsync(options)`**

Asynchronously register the testing module with dynamic configuration.

```typescript
CognitoTestingModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    identityProvider: {
      region: config.get("COGNITO_REGION"),
    },
  }),
  inject: [ConfigService],
});
```

**`createJwtVerifierFactory()`**

Factory function for overriding the JWT verifier provider in mock mode.

```typescript
.overrideProvider(COGNITO_JWT_VERIFIER_INSTANCE_TOKEN)
.useFactory({
  factory: CognitoTestingModule.createJwtVerifierFactory
})
```

### CognitoTestingService

Service for managing test authentication.

**Methods:**

**`getAccessToken(credentials, clientId): Promise<string>`**

Obtain an access token for testing (works with both real and mock modes).

```typescript
const accessToken = await cognitoTestingService.getAccessToken(
  {
    username: "test@example.com",
    password: "TestPassword123!",
  },
  "your-client-id"
);
```

**`getIdToken(credentials, clientId): Promise<string>`**

Obtain an ID token for testing (works with both real and mock modes).

```typescript
const idToken = await cognitoTestingService.getIdToken(
  {
    username: "test@example.com",
    password: "TestPassword123!",
  },
  "your-client-id"
);
```

**`setMockConfig(mockOptions): Promise<void>`**

Update the mock configuration at runtime.

```typescript
await cognitoTestingService.setMockConfig({
  enabled: true,
  user: {
    username: "new-user",
    email: "new@example.com",
    groups: ["admin"],
  },
});
```

### CognitoMockService

Low-level service for mock JWT token generation and verification.

**Methods:**

**`generateToken(user): string`**

Generate a mock JWT token for the specified user.

**`verify(token): Promise<any>`**

Verify and decode a mock JWT token.

## Testing Patterns

### Testing Different User Roles

```typescript
describe("Role-based Authorization", () => {
  let cognitoTestingService: CognitoTestingService;

  it("should allow admin access", async () => {
    await cognitoTestingService.setMockConfig({
      enabled: true,
      user: {
        username: "admin",
        email: "admin@example.com",
        groups: ["admin"],
      },
    });

    const token = await getLoginToken("admin");
    const response = await request(app.getHttpServer())
      .delete("/admin/users/123")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should deny regular user access", async () => {
    await cognitoTestingService.setMockConfig({
      enabled: true,
      user: {
        username: "user",
        email: "user@example.com",
        groups: ["users"],
      },
    });

    const token = await getLoginToken("user");
    await request(app.getHttpServer())
      .delete("/admin/users/123")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });
});
```

### Testing Token Expiration

```typescript
describe("Token Expiration", () => {
  it("should reject expired tokens", async () => {
    // Generate token with custom expiration
    const expiredToken = cognitoMockService.generateToken({
      username: "test-user",
      email: "test@example.com",
      exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    });

    await request(app.getHttpServer())
      .get("/protected-route")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);
  });
});
```

### Testing GraphQL Endpoints

```typescript
import { CognitoTestingModule } from "@nestjs-cognito/testing";

describe("GraphQL Authentication", () => {
  it("should authenticate GraphQL queries", async () => {
    const token = await getLoginToken("test-user");

    const response = await request(app.getHttpServer())
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `
          query {
            getCurrentUser {
              username
              email
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.data.getCurrentUser.username).toBe("test-user");
  });
});
```

## Related Packages

- **[@nestjs-cognito/auth](https://www.npmjs.com/package/@nestjs-cognito/auth)** - Authentication and authorization for REST APIs
- **[@nestjs-cognito/graphql](https://www.npmjs.com/package/@nestjs-cognito/graphql)** - GraphQL support for Cognito authentication
- **[@nestjs-cognito/core](https://www.npmjs.com/package/@nestjs-cognito/core)** - Core functionality and AWS Cognito integration

## Resources

- [Documentation](https://lokicoule.github.io/nestjs-cognito/)
- [GitHub Repository](https://github.com/Lokicoule/nestjs-cognito)
- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)

## License

**@nestjs-cognito/testing** is [MIT licensed](LICENSE).
