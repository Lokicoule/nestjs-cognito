---
"@nestjs-cognito/core": minor
"@nestjs-cognito/auth": minor
---

- Type your user pool's custom attributes by augmenting `CognitoCustomClaims`. They are added to `CognitoJwtPayload`, `CognitoIdTokenPayload` and `CognitoAccessTokenPayload`.
- `User` exposes `sub` and `payload` (all token claims).
