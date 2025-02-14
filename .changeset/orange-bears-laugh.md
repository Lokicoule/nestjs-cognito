---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/testing": minor
"@nestjs-cognito/core": minor
"@nestjs-cognito/graphql": patch
---

Core package:
- Added new type definition `CognitoJwtPayload` for improved type safety
- Update README.md

Auth package:
- Enhanced error handling by replacing `UnauthorizedException` with `BadRequestException` for invalid credentials
- Added detailed error messages for better debugging and user feedback
- Update README.md

Graphql package:
- Update README.md

Testing package:
- Improved HTTP status code in authentication responses from 201 to 200 to align with RESTful API best practices (login endpoint returns a token rather than creating a resource)
- Enhanced error simulation capabilities for testing scenarios
- Update README.md