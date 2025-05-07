---
"@nestjs-cognito/auth": patch
---

Auth package:
- Changed HTTP status code from 400 (BadRequestException) to 401 (UnauthorizedException) for missing/invalid tokens in AbstractGuard (#1276, 1aeaf36)
