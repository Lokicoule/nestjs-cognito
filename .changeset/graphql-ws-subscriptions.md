---
"@nestjs-cognito/auth": patch
---

GraphQL subscriptions over graphql-ws read the bearer token from `connectionParams.authorization`, where graphql-ws clients send it. Only connection cookies worked before.
