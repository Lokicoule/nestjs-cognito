---
"@nestjs-cognito/auth": minor
---

- `CognitoAuthModule` now fails at startup when no `jwtVerifier` or `jwtRsaVerifier` is configured. Before this change, the app started and every protected route answered 401.
- `CognitoTokenTypeMismatchError` extends `UnauthorizedException`: a token type mismatch returns 401 instead of 500.
