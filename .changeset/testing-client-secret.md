---
"@nestjs-cognito/testing": minor
---

Support app clients with a secret: `CognitoTestingModule.register(config, mockConfig, { clientSecret })` sends the `SECRET_HASH` Cognito requires. `clientSecret` can be a function, read on every call, so rotated secrets apply without a restart.
