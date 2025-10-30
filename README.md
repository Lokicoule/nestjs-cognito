<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header.svg?raw=true" alt="NestJS-Cognito" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Lokicoule/nestjs-cognito?style=social)](https://github.com/Lokicoule/nestjs-cognito/stargazers)

</div>

<div align="center">
  <h3>AWS Cognito authentication for NestJS</h3>
  <p>Stop writing boilerplate. Protect your routes with a decorator.</p>
</div>

---

## What is this?

You're building a NestJS app. You chose AWS Cognito for authentication. Now you need to verify JWT tokens, handle multiple user pools, extract tokens from headers or cookies, and implement role-based authorization.

You could spend days writing boilerplate. Or you could use this.

One decorator protects your routes. Built on [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify).

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

## Why use this?

- **Fast setup** — 5 minutes from install to protected routes
- **Type-safe** — Full TypeScript support
- **Production-ready** — Built on AWS's official JWT verification library
- **Zero boilerplate** — Decorators replace hundreds of lines
- **Flexible** — REST, GraphQL, cookies, multiple user pools, custom extractors
- **Testable** — Mock and E2E test utilities included

## Quick start

Install:

```bash
npm install @nestjs-cognito/core @nestjs-cognito/auth
```

Configure:

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

Protect routes:

```typescript
import { Authentication, Authorization, CognitoUser } from '@nestjs-cognito/auth';

@Controller('admin')
@Authorization(['admin'])
export class AdminController {
  @Get('dashboard')
  getDashboard(@CognitoUser() user: CognitoJwtPayload) {
    return { message: `Welcome ${user['cognito:username']}` };
  }
}
```

Done.

## Packages

| Package | What it does | npm |
|---------|--------------|-----|
| **[@nestjs-cognito/core](./packages/core)** | JWT verification, token extraction | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Fcore.svg)](https://www.npmjs.com/package/@nestjs-cognito/core) |
| **[@nestjs-cognito/auth](./packages/auth)** | Decorators, guards, authorization | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Fauth.svg)](https://www.npmjs.com/package/@nestjs-cognito/auth) |
| **[@nestjs-cognito/graphql](./packages/graphql)** | GraphQL authentication | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Fgraphql.svg)](https://www.npmjs.com/package/@nestjs-cognito/graphql) |
| **[@nestjs-cognito/testing](./packages/testing)** | Mock and E2E test utilities | [![npm](https://badge.fury.io/js/%40nestjs-cognito%2Ftesting.svg)](https://www.npmjs.com/package/@nestjs-cognito/testing) |

## Examples

### Role-based authorization

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

### Public routes with optional auth

```typescript
@Controller('products')
@Authentication()
export class ProductsController {
  @Get(':id')
  @PublicRoute()
  getProduct(@Param('id') id: string, @CognitoUser() user?: CognitoJwtPayload) {
    const product = this.findProduct(id);

    return {
      ...product,
      price: user ? this.getMemberPrice(product) : product.regularPrice,
      memberBenefits: user ? this.getBenefits(product) : null,
    };
  }
}
```

### GraphQL

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

### Multiple user pools

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

### Cookie authentication

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

### Testing

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

## Contributing

Found a bug? Have an idea? Pull requests are welcome.

1. Fork the repo
2. Create your feature branch
3. Commit your changes
4. Push and open a PR

See [CONTRIBUTING.md](https://github.com/Lokicoule/nestjs-cognito/blob/main/CONTRIBUTING.md) for details.

## Documentation

[Full documentation →](https://lokicoule.github.io/nestjs-cognito/)

Package READMEs:
- [Core](./packages/core/README.md)
- [Auth](./packages/auth/README.md)
- [GraphQL](./packages/graphql/README.md)
- [Testing](./packages/testing/README.md)
- [Examples](./sample)

## License

MIT

---

Made by [@Lokicoule](https://github.com/Lokicoule)
