---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/graphql": minor
---

- `@nestjs-cognito/auth` handles GraphQL resolvers: `@Authentication`, `@Authorization` and `@CognitoUser` / `@CognitoAccessUser` / `@CognitoIdUser` work on them, including graphql-ws cookies.
- `@nestjs-cognito/graphql` is deprecated. Its `Gql*` exports and guards are now aliases of the `@nestjs-cognito/auth` ones, and it no longer requires `@nestjs/graphql`. It will be removed in 5.0.
