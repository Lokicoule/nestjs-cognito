<div align="center">
 <img src="https://github.com/lokicoule/nestjs-cognito/blob/main/media/repo-header.svg?raw=true" alt="NestJS-Cognito" />
</div>

<div align="center">

[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Overview

@nestjs-cognito is a powerful, type-safe library that provides seamless integration of AWS Cognito authentication into NestJS applications. Built on top of [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify), it offers robust token verification and comprehensive authentication solutions.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| **@nestjs-cognito/core** | Core functionality and AWS Cognito integration | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Fcore.svg)](https://www.npmjs.com/package/@nestjs-cognito/core) |
| **@nestjs-cognito/auth** | Authentication module with guards and decorators | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Fauth.svg)](https://www.npmjs.com/package/@nestjs-cognito/auth) |
| **@nestjs-cognito/graphql** | GraphQL integration support | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Fgraphql.svg)](https://www.npmjs.com/package/@nestjs-cognito/graphql) |
| **@nestjs-cognito/testing** | E2E testing utilities for real-world Cognito authentication scenarios | [![npm version](https://badge.fury.io/js/%40nestjs-cognito%2Ftesting.svg)](https://www.npmjs.com/package/@nestjs-cognito/testing) |

## Installation

```bash
# Core and authentication modules
npm install @nestjs-cognito/core @nestjs-cognito/auth

# Optional: GraphQL support
npm install @nestjs-cognito/graphql

# Optional: Testing utilities
npm install -D @nestjs-cognito/testing
```

## Documentation

For detailed documentation, examples, and advanced usage, visit our [Documentation Site](https://lokicoule.github.io/nestjs-cognito/).

## Resources

- [GitHub Repository](https://github.com/Lokicoule/nestjs-cognito)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
- [NestJS Documentation](https://docs.nestjs.com/)

## License

Distributed under the MIT License. See `LICENSE` for more information.
