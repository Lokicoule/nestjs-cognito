# Changelog:

## Latest Updates

### GraphQL WebSocket Cookie Support

Added support for HTTP-only cookies with graphql-ws subscriptions. Previously, when using graphql-ws and subscriptions, HTTP-only cookies were missing at the point of authentication and would fail.

**Issue**: The `AuthenticationGuard` in the GraphQL package builds a GQL context and returns a request, but downstream authentication expects a `cookies` property to be present, which works for HTTP requests ✅ but not for WebSockets 🤔.

**Solution**: Enhanced cookie extraction to support the graphql-ws context structure where cookies are passed in `ctx.request?.extra?.request?.headers?.cookie`.

**Technical Details**:
- The `CookieJwtExtractor` now properly handles WebSocket contexts
- Cookies are extracted from the nested structure: `ctx.request?.extra?.request?.headers?.cookie`
- This enables seamless authentication for GraphQL subscriptions using HTTP-only cookies
- Maintains backward compatibility with existing HTTP cookie authentication

**Usage**: No changes required for existing implementations. The enhanced cookie extraction works automatically with graphql-ws subscriptions.

## @nestjs-cognito/core:

- The code for importing and registering the CognitoAuthModule has changed.
- The old code:

```ts
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoAuthModule.register({
      region: region,
    }),
  ],
})
export class AppModule {}
```

- The new code:

```ts
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    CognitoAuthModule.register({
      jwtVerifier: {
        userPoolId: "user_pool_id",
        clientId: "client_id",
        tokenUse: "id",
      },
    }),
  ],
})
export class AppModule {}
```

## @nestjs-cognito/auth:

- Replaced "CurrentUser" with "CognitoUser".
- "CurrentUser" is now deprecated.

## @nestjs-cognito/graphql:

- Added the "Gql" prefix before all decorators.
- "Authentication" and "Authorization" decorators are now deprecated for the graphql module and have been replaced by "GqlAuthentication" and "GqlAuthorization".
- Replaced "CurrentUser" with "GqlCognitoUser".
- "CurrentUser" is now deprecated.
