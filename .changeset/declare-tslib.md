---
"@nestjs-cognito/core": patch
"@nestjs-cognito/auth": patch
"@nestjs-cognito/graphql": patch
"@nestjs-cognito/testing": patch
---

Declare `tslib` as a dependency. The compiled output imports its helpers from `tslib` (`importHelpers`), but the package did not declare it. It only resolved when a hoisted copy happened to be available, and failed with `Cannot find module 'tslib'` under strict installs.
