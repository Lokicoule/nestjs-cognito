---
"@nestjs-cognito/core": minor
"@nestjs-cognito/auth": patch
"@nestjs-cognito/graphql": patch
"@nestjs-cognito/testing": patch
---

Remove `any` from the public types. `CognitoJwtExtractor` takes an optional request type (`CognitoJwtExtractor<Request>`), defaulting to `unknown`. Existing extractors and guards compile unchanged.
