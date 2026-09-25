---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/graphql": minor
---

`@Authentication`, `@Authorization`, `@GqlAuthentication` and `@GqlAuthorization` accept `tokenUse: "access" | "id"`: the other token type is rejected with a 401. A handler-level value overrides the controller.
