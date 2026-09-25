---
"@nestjs-cognito/testing": minor
"@nestjs-cognito/core": patch
---

- Mock tokens match Cognito's. The access token carries `client_id`, `username` and `scope`. The ID token carries `aud`, `email` and the custom attributes. The refresh token is opaque.
- `MockUserConfig` accepts `sub` and `scopes`, and `MockConfig.expiresIn` sets the token lifetime (a negative value issues expired tokens). `CognitoMockService.createClientCredentialsToken()` issues machine-to-machine tokens.
- `createJwtVerifierFactory()` rejects expired tokens.
- `CognitoModule.register()` provides its instances through factories, so `overrideProvider(...).useFactory(...)` applies to them. It was silently ignored before.
