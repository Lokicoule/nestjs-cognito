---
"@nestjs-cognito/core": minor
"@nestjs-cognito/auth": minor
---

`CognitoAuthModule` preloads the JWKS at startup, so the first request doesn't wait for the key download. If it fails, a warning is logged and the keys are fetched on the first request. The verifier adapter exposes `hydrate()`.
