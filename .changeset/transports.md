---
"@nestjs-cognito/auth": minor
"@nestjs-cognito/core": minor
---

- One global `AuthenticationGuard` (`APP_GUARD`) covers HTTP, GraphQL, socket.io and microservices.
- socket.io: `BearerJwtExtractor` also reads `handshake.auth.token`, which browsers can send.
- Microservices: the user is stored on the transport context instead of the message data.
- `CognitoWsExceptionFilter` and `CognitoRpcExceptionFilter` return authentication errors to the client with the HTTP body, instead of "Internal server error".
