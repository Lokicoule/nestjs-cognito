<h1 align="center">@nestjs-cognito/testing</h1>

[![Node.js CI](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml/badge.svg)](https://github.com/Lokicoule/nestjs-cognito/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/Lokicoule/nestjs-cognito/badge.svg?branch=main)](https://coveralls.io/github/Lokicoule/nestjs-cognito?branch=main)

## Description

[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) utilities module for [Nest](https://github.com/nestjs/nest).
This module is intended for end-to-end and integration testing.

## Installation

```bash
npm i @nestjs-cognito/testing
```

## Usage

```ts
@Module({
  imports: [
    CognitoTestingModule.register({
      region: "eu-west-1",
    }),
  ],
})
export class AppModule {}
```

Now, you can call the method `cognito-testing-login` and pass to the body the following properties :

- username : The username of the test user
- password : The password of the test user
- clientId : Must be filled in order to use `initiateAuth` method exposed by @aws-sdk/client-cognito-identity-provider.

## Example with Jest and Pactum

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
