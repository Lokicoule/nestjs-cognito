---
"@nestjs-cognito/auth": patch
"@nestjs-cognito/graphql": patch
"@nestjs-cognito/testing": patch
---

Declare peer dependencies that were imported but not declared. The packages only worked when these modules were hoisted, which strict installs (pnpm without hoisting, Yarn PnP) do not do:

- `@nestjs-cognito/auth`: `@nestjs/core`
- `@nestjs-cognito/graphql`: `@nestjs/common`, `@nestjs/graphql`
- `@nestjs-cognito/testing`: `@nestjs/common`, `@nestjs-cognito/core`, `@aws-sdk/client-cognito-identity-provider`

Every application using these packages already has these modules installed, so no action is needed.
