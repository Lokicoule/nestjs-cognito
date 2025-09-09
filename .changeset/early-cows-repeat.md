---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/core": minor
---

## Features

- Add configurable JWT token extraction with `CognitoJwtExtractor` interface
- Add `BearerJwtExtractor` and `CookieJwtExtractor` implementations
- Add `jwtExtractor` option to `CognitoModuleOptions`
- Add `@InjectCognitoJwtExtractor()` decorator

## Fixes

- Update @apollo/server to v5
- Fix GitHub Actions workflow pnpm configuration

## Chores

- Update TypeScript ESLint to v8.43.0
- Update Node.js setup action to v5
- Update upload-pages-artifact action to v4
- Update checkout action to v5
- Update Node.js to v22
- Update pnpm to v9.15.9
- Update various dependencies
