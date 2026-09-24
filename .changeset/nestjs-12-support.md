---
"@nestjs-cognito/core": minor
"@nestjs-cognito/auth": minor
"@nestjs-cognito/graphql": minor
"@nestjs-cognito/testing": minor
---

Support NestJS 12.

The `@nestjs/common` peer range now includes `^12.0.0`. The packages still ship CommonJS; on NestJS 12, which is ESM-only, this relies on Node.js `require(esm)`, so it needs Node.js 20.19+ or 22.12+ (the same floor NestJS 12 itself requires). NestJS 8–11 users are unaffected.
