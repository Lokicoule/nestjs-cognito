import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { request, spec } from 'pactum';
import { AppModule } from './app.module';

describe('Cognito Module', () => {
  let app: INestApplication;
  let config: ConfigService;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modRef.createNestApplication();
    await app.listen(0);
    const url = (await app.getUrl()).replace('[::1]', 'localhost');
    request.setBaseUrl(url);
    config = modRef.get<ConfigService>(ConfigService);
  });

  describe('Basic flow', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should return hello', async () => {
      await spec().get('/public').expectStatus(200).expectBody({
        message: 'Hello open world!',
      });
    });
  });

  describe('Authenticated flow: user without group', () => {
    it("should be able to log in and get a jwt and can access to authenticated routes and protected one 'no-admin'", async () => {
      await spec()
        .post('/login')
        .withBody({
          username: config.get('COGNITO_USER_EMAIL'),
          password: config.get('COGNITO_USER_PASSWORD'),
        })
        .expectStatus(201)
        .stores('token', 'AccessToken');
      await spec()
        .get('/private')
        .withHeaders('Authorization', 'Bearer $S{token}')
        .expectBody({ message: 'Hello ' + config.get('COGNITO_USER_EMAIL') });
      await spec()
        .get('/authentication-decorator')
        .withHeaders('Authorization', 'Bearer $S{token}')
        .expectBody({ message: 'Hello ' + config.get('COGNITO_USER_EMAIL') });
      await spec()
        .get('/admin')
        .withHeaders('Authorization', 'Bearer $S{token}')
        .expectStatus(403);
      await spec()
        .get('/authorization-decorator')
        .withHeaders('Authorization', 'Bearer $S{token}')
        .expectStatus(403);
      await spec()
        .get('/no-admin')
        .withHeaders('Authorization', 'Bearer $S{token}')
        .expectBody({ message: 'Hello ' + config.get('COGNITO_USER_EMAIL') });
    });
  });

  describe('Authorized Flow: user with admin group', () => {
    it("should be able to log in and get a jwt, and can access to protected routes except 'no-admin'", async () => {
      await spec()
        .post('/login')
        .withBody({
          username: config.get('COGNITO_USER_EMAIL_ADMIN'),
          password: config.get('COGNITO_USER_PASSWORD_ADMIN'),
        })
        .expectStatus(201)
        .stores('authorized-flow-token', 'AccessToken');
      await spec()
        .get('/admin')
        .withHeaders('Authorization', 'Bearer $S{authorized-flow-token}')
        .expectBody({
          message: 'Hello ' + config.get('COGNITO_USER_EMAIL_ADMIN'),
        });
      await spec()
        .get('/authorization-decorator')
        .withHeaders('Authorization', 'Bearer $S{authorized-flow-token}')
        .expectBody({
          message: 'Hello ' + config.get('COGNITO_USER_EMAIL_ADMIN'),
        });
      await spec()
        .get('/no-admin')
        .withHeaders('Authorization', 'Bearer $S{authorized-flow-token}')
        .expectStatus(403);
    });
  });

  describe('Unauthenticated flow', () => {
    it('should return a 401 for an invalid login', async () => {
      await spec()
        .post('/login')
        .withBody({ username: 'test1', password: 'not the right password' })
        .expectStatus(401);
    });
    it('should return a 401 for an invalid JWT', async () => {
      await spec()
        .get('/private')
        .withHeaders('Authorization', 'Bearer not-a-jwt')
        .expectStatus(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
