# Changelog:

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
