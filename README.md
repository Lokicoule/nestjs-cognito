<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header.svg?raw=true" alt="NestJS-Cognito" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Lokicoule/nestjs-cognito?style=social)](https://github.com/Lokicoule/nestjs-cognito/stargazers)

</div>

<div align="center">
  <h3>Seamless AWS Cognito Authentication for NestJS</h3>
  <p>Stop wrestling with authentication. Start building features.</p>
</div>

---

## The Challenge

You're building a NestJS application. AWS Cognito is your authentication provider. Simple, right?

**Not quite.**

You need to verify JWT tokens. Handle multiple user pools. Extract tokens from headers or cookies. Implement role-based authorization. Support GraphQL. Write testable code. Configure everything type-safely.

Suddenly, your authentication layer is hundreds of lines of boilerplate code, repeated security checks, and fragile token validation logic.

**There has to be a better way.**

## The Solution

@nestjs-cognito transforms AWS Cognito integration from a multi-day struggle into a 5-minute setup. Built on top of [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify), it provides production-ready authentication with elegant decorators, automatic token verification, and zero boilerplate.

**One decorator to authenticate. One decorator to authorize. Zero headaches.**

```typescript
@Controller('profile')
@Authentication()  // That's it. Route protected.
export class ProfileController {
  @Get()
  getProfile(@CognitoUser() user: CognitoJwtPayload) {
    return { username: user['cognito:username'] };
  }
}
```

## Why Developers Choose @nestjs-cognito

**"Finally, authentication that doesn't slow us down"**

- **5-Minute Setup** - From npm install to protected routes in minutes, not days
- **Type-Safe** - Full TypeScript support catches auth bugs at compile time
- **Battle-Tested** - Powers production apps processing millions of requests
- **Zero Boilerplate** - Clean decorators replace hundreds of lines of validation code
- **Flexible** - Works with REST, GraphQL, cookies, multiple user pools, custom extractors
- **Testable** - Built-in testing utilities for both mocked and real authentication flows

## Star This Project ⭐

If @nestjs-cognito saves you hours of authentication headaches, **give it a star**. It helps other developers discover this solution and motivates us to keep improving it.

<div align="center">
  <a href="https://github.com/Lokicoule/nestjs-cognito/stargazers">
    <img src="https://img.shields.io/github/stars/Lokicoule/nestjs-cognito?style=for-the-badge&logo=github" alt="Star on GitHub" />
  </a>
</div>

## Quick Start

### Installation

```bash
npm install @nestjs-cognito/core @nestjs-cognito/auth
```

### Configure Your App

```typescript
import { CognitoAuthModule } from '@nestjs-cognito/auth';

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: 'us-east-1_xxxxx',
        clientId: 'your-client-id',
        tokenUse: 'access',
      },
    }),
  ],
})
export class AppModule {}
```

### Protect Your Routes

```typescript
import { Authentication, Authorization, CognitoUser } from '@nestjs-cognito/auth';

@Controller('admin')
@Authorization(['admin'])  // Only admins allowed
export class AdminController {
  @Get('dashboard')
  getDashboard(@CognitoUser() user: CognitoJwtPayload) {
    return { message: `Welcome ${user['cognito:username']}` };
  }
}
```

**That's it.** Your routes are now protected with AWS Cognito authentication.

## Packages

Our modular architecture lets you use exactly what you need:

| Package | Purpose | npm |
|---------|---------|-----|
| **[@nestjs-cognito/core](./packages/core)** | JWT verification, token extraction, AWS integration | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Fcore.svg)](https://www.npmjs.com/package/@nestjs-cognito/core) |
| **[@nestjs-cognito/auth](./packages/auth)** | Authentication decorators, guards, authorization | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Fauth.svg)](https://www.npmjs.com/package/@nestjs-cognito/auth) |
| **[@nestjs-cognito/graphql](./packages/graphql)** | GraphQL resolver authentication | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Fgraphql.svg)](https://www.npmjs.com/package/@nestjs-cognito/graphql) |
| **[@nestjs-cognito/testing](./packages/testing)** | Testing utilities (mock & E2E) | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Ftesting.svg)](https://www.npmjs.com/package/@nestjs-cognito/testing) |

## Real-World Examples

### Role-Based Authorization

```typescript
@Controller('content')
export class ContentController {
  @Get()
  @Authorization({ allowedGroups: ['user', 'admin'] })
  list() {
    return { content: [] };  // Either user OR admin can access
  }

  @Post()
  @Authorization({ requiredGroups: ['moderator', 'admin'] })
  create() {
    return { created: true };  // Must be BOTH moderator AND admin
  }

  @Delete(':id')
  @Authorization({
    allowedGroups: ['admin'],
    prohibitedGroups: ['banned']  // Admins yes, banned users no
  })
  delete() {
    return { deleted: true };
  }
}
```

### Public Routes with Optional Auth

Perfect for e-commerce, content platforms, or any "login to see more" scenario:

```typescript
@Controller('products')
@Authentication()
export class ProductsController {
  @Get(':id')
  @PublicRoute()  // Public, but auth unlocks premium features
  getProduct(@Param('id') id: string, @CognitoUser() user?: CognitoJwtPayload) {
    const product = this.findProduct(id);

    return {
      ...product,
      // Authenticated users get member pricing
      price: user ? this.getMemberPrice(product) : product.regularPrice,
      // Extra details for logged-in users
      memberBenefits: user ? this.getBenefits(product) : null,
    };
  }
}
```

### GraphQL Support

First-class GraphQL integration with specialized decorators:

```typescript
import { GqlAuthentication, GqlAuthorization, GqlCognitoUser } from '@nestjs-cognito/graphql';

@Resolver()
@GqlAuthentication()
export class UserResolver {
  @Query(() => User)
  me(@GqlCognitoUser() user: CognitoJwtPayload) {
    return {
      id: user.sub,
      username: user['cognito:username'],
      email: user.email,
    };
  }

  @Query(() => [User])
  @GqlAuthorization(['admin'])
  users() {
    return this.userService.findAll();
  }
}
```

### Multiple User Pools

Enterprise apps often need to support multiple Cognito User Pools:

```typescript
CognitoAuthModule.register({
  jwtVerifier: [
    {
      userPoolId: 'us-east-1_customers',
      clientId: 'customer-app-client',
      tokenUse: 'access',
    },
    {
      userPoolId: 'us-east-1_employees',
      clientId: 'admin-app-client',
      tokenUse: 'id',
    },
  ],
})
```

### Cookie-Based Authentication

Perfect for web applications that prefer cookies over bearer tokens:

```typescript
import { CookieJwtExtractor } from '@nestjs-cognito/core';

CognitoAuthModule.register({
  jwtExtractor: new CookieJwtExtractor('access_token'),
  jwtVerifier: {
    userPoolId: 'us-east-1_xxxxx',
    clientId: 'your-client-id',
    tokenUse: 'id',
  },
})
```

### Testing Made Easy

Mock authentication for unit tests, real Cognito for E2E:

```typescript
import { CognitoTestingModule } from '@nestjs-cognito/testing';

const module = await Test.createTestingModule({
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
  .useFactory({ factory: CognitoTestingModule.createJwtVerifierFactory })
  .compile();
```

## Architecture

```
@nestjs-cognito/
├── core/           - JWT verification, token extraction, AWS SDK integration
├── auth/           - Authentication guards, decorators, authorization logic
├── graphql/        - GraphQL-specific authentication and context handling
└── testing/        - Testing utilities for mock and real E2E tests
```

**Package Dependencies:**
- `@nestjs-cognito/auth` → `@nestjs-cognito/core`
- `@nestjs-cognito/graphql` → `@nestjs-cognito/auth` + `@nestjs-cognito/core`
- `@nestjs-cognito/testing` → `@nestjs-cognito/core`

## Join the Community

**@nestjs-cognito is open source and thrives on community contributions.**

### Ways to Contribute

- **Report Bugs** - Found an issue? [Open an issue](https://github.com/Lokicoule/nestjs-cognito/issues/new)
- **Request Features** - Have an idea? [Start a discussion](https://github.com/Lokicoule/nestjs-cognito/discussions)
- **Improve Documentation** - Fix typos, add examples, clarify concepts
- **Submit Pull Requests** - Fix bugs, add features, improve performance

### Recognition

Every contributor is recognized in our [Contributors](https://github.com/Lokicoule/nestjs-cognito/graphs/contributors) section. Your name could be there too.

### Getting Started with Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Check our [Contributing Guidelines](https://github.com/Lokicoule/nestjs-cognito/blob/main/CONTRIBUTING.md) for more details.

## Support This Project

If @nestjs-cognito is helpful to you, consider:

- **Starring the repository** - Helps others discover the project
- **Contributing** - Code, documentation, bug reports, or feature ideas

<div align="center">
  <a href="https://github.com/Lokicoule/nestjs-cognito/stargazers">
    <img src="https://img.shields.io/github/stars/Lokicoule/nestjs-cognito?style=for-the-badge&logo=github" alt="Star on GitHub" />
  </a>
</div>

## Documentation

- [Official Documentation](https://lokicoule.github.io/nestjs-cognito/) - Complete guides and API reference
- [Core Package](./packages/core/README.md) - JWT verification and AWS integration
- [Auth Package](./packages/auth/README.md) - Authentication and authorization
- [GraphQL Package](./packages/graphql/README.md) - GraphQL support
- [Testing Package](./packages/testing/README.md) - Testing utilities
- [Sample Applications](./sample) - Working examples

## Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify)

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Lokicoule">@Lokicoule</a> and the community</p>
  <p>
    <a href="https://github.com/Lokicoule/nestjs-cognito">GitHub</a> •
    <a href="https://lokicoule.github.io/nestjs-cognito/">Documentation</a> •
    <a href="https://github.com/Lokicoule/nestjs-cognito/issues">Issues</a> •
    <a href="https://github.com/Lokicoule/nestjs-cognito/discussions">Discussions</a>
  </p>
</div>
