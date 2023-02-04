<h1 align="center">@nestjs-cognito/testing</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)

## Description

This module is a solution for [NestJS](https://github.com/nestjs/nest) which facilitates the integration with [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) for end-to-end and integration testing purposes. It includes a module, a controller, and a service that simplify testing your authentication and authorization code based on [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html).

## Installation

```bash
npm install @nestjs-cognito/testing
```

## Usage

### Module

To use the `CognitoTestingModule`, you will need to import it and use either the `register` or `registerAsync` method to set up its dependencies:

```ts
@Module({
  imports: [
    CognitoTestingModule.register({
      identityProvider: {
        region: "eu-west-1",
      },
    }),
  ],
})
export class AppModule {}
```

### Controller

The `CognitoTestingController` is a simple controller that accepts a username and password and returns an access token. The code is shown below:

<details>
<summary>Controller Source Code</summary>

```ts
import { Body, Controller, Post } from "@nestjs/common";
import { CognitoTestingService } from "@nestjs-cognito/testing";

@Controller()
export class CognitoTestingController {
  constructor(private readonly authService: CognitoTestingService) {}

  @Post("cognito-testing-login")
  login(@Body() body: Record<string, string>) {
    return this.authService.getAccessToken(
      {
        username: body.username,
        password: body.password,
      },
      body.clientId
    );
  }
}
```

</details>

### Service

The `CognitoTestingService` is a service that uses the `CognitoIdentityProvider` client to get an access token. To call the method `cognito-testing-login`, you need to pass the following information in the request body:

- `username`: The username of the test user
- `password`: The password of the test user
- `clientId`: Required for using the initiateAuth method provided by `@aws-sdk/client-cognito-identity-provider`.

## Example using Jest and Pactum

```ts
import { CognitoTestingModule } from "@nestjs-cognito/testing";
import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { request, spec } from "pactum";

describe("Cognito Module : Testing", () => {
  let app: INestApplication;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        CognitoTestingModule.register({
          region: "eu-west-1",
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    config = moduleFixture.get<ConfigService>(ConfigService);

    await app.listen(0);
    const url = (await app.getUrl()).replace("[::1]", "localhost");
    request.setBaseUrl(url);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("authentication", () => {
    it("should be able to access the private route", async () => {
      await spec()
        .post("/cognito-testing-login")
        .withBody({
          username: config.get("COGNITO_USER_EMAIL"),
          password: config.get("COGNITO_USER_PASSWORD"),
          clientId: config.get("COGNITO_CLIENT_ID"),
        })
        .expectStatus(201)
        .expectBodyContains("AccessToken").
        .stores('token', 'AccessToken');
      await spec()
        .get('/private')
        .withHeaders('Authorization', 'Bearer $S{token}')
        .expectStatus(200);
    });
  });
});
```

## License

<b>@nestjs-cognito/testing</b> is [MIT licensed](LICENSE).
