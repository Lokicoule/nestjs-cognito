---
"@nestjs-cognito/auth": minor
---

## Dependency Updates
- Update @aws-sdk/client-cognito-identity-provider to v3.879.0
- Update jest to v30.1.1
- Update typescript-eslint monorepo to v8.41.0
- Update ts-loader to v9.5.4
- Update eslint to v9.34.0
- Update various other dependencies

## New Feature: Client Credentials Flow Support
  
Add support for AWS Cognito client credentials flow (machine-to-machine authentication):

- **BREAKING**: `User.username` is now optional (`string | undefined`)
- Add `User.clientId` property for client credentials authentication
- Update `UserMapper` to handle tokens without username by using `client_id`
- Add `UserBuilder.setClientId()` method
- Improve error messaging for authentication requirements
- Add comprehensive test coverage for client credentials scenarios

This resolves authentication errors when using client credentials flow where no username is present in the JWT payload (#1400).
