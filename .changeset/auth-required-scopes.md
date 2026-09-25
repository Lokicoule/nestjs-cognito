---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/graphql": patch
---

- `@Authorization` / `@GqlAuthorization` accept `requiredScopes`: the token's `scope` claim must contain all of them (case-sensitive). This covers client credentials (machine-to-machine) tokens. `User` exposes `scopes`.
- User access tokens keep their `username`: they were mistaken for client credentials tokens.
