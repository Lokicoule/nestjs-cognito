---
"@nestjs-cognito/auth": patch
---

Fix a type error in the published declarations (`user.builder.d.ts`, TS2411) for apps compiled with `strict` and `skipLibCheck: false`. The builder's `payload` getter now uses `CognitoJwtPayload`, so it also picks up custom claims declared through `CognitoCustomClaims`.
