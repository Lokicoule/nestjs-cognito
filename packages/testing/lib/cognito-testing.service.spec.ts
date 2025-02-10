import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CognitoTestingService } from './cognito-testing.service';
import { CognitoMockService } from './cognito-mock.service';
import { COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN } from '@nestjs-cognito/core';

describe('CognitoTestingService', () => {
  let service: CognitoTestingService;
  let cognitoMockService: CognitoMockService;
  let cognitoClient: any;

  const mockTokens = {
    AccessToken: 'mock-access-token',
    IdToken: 'mock-id-token',
    RefreshToken: 'mock-refresh-token',
    TokenType: 'Bearer',
    ExpiresIn: 3600,
  };

  beforeEach(async () => {
    cognitoClient = {
      initiateAuth: jest.fn(),
      respondToAuthChallenge: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CognitoTestingService,
        {
          provide: CognitoMockService,
          useValue: {
            setMockConfig: jest.fn(),
            getMockTokens: jest.fn().mockResolvedValue(mockTokens),
            verifyToken: jest.fn().mockResolvedValue({
              'cognito:username': 'testuser',
              email: 'test@example.com',
              'cognito:groups': ['testgroup'],
            }),
          },
        },
        {
          provide: COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN,
          useValue: cognitoClient,
        },
      ],
    }).compile();

    service = module.get<CognitoTestingService>(CognitoTestingService);
    cognitoMockService = module.get<CognitoMockService>(CognitoMockService);
  });

  describe('getAccessToken', () => {
    const credentials = { username: 'testuser', password: 'password' };
    const clientId = 'test-client-id';

    describe('when mock is enabled', () => {
      beforeEach(() => {
        service.setMockConfig({ enabled: true, user: { username: 'testuser' } });
      });

      it('should return mock tokens', async () => {
        const result = await service.getAccessToken(credentials, clientId);
        expect(result).toEqual(mockTokens);
        expect(cognitoMockService.getMockTokens).toHaveBeenCalledWith(clientId);
      });

      it('should throw BadRequestException when no mock user is configured', async () => {
        service.setMockConfig({ enabled: true });
        await expect(service.getAccessToken(credentials, clientId)).rejects.toThrow(
          BadRequestException
        );
      });
    });

    describe('when mock is disabled', () => {
      beforeEach(() => {
        service.setMockConfig({ enabled: false });
      });

      it('should handle successful authentication', async () => {
        cognitoClient.initiateAuth.mockResolvedValue({
          AuthenticationResult: mockTokens,
        });

        const result = await service.getAccessToken(credentials, clientId);
        expect(result).toEqual(mockTokens);
        expect(cognitoClient.initiateAuth).toHaveBeenCalledWith({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: clientId,
          AuthParameters: {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
          },
        });
      });

      it('should handle NEW_PASSWORD_REQUIRED challenge', async () => {
        cognitoClient.initiateAuth.mockResolvedValueOnce({
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          Session: 'session-token',
        });
        cognitoClient.respondToAuthChallenge.mockResolvedValueOnce({
          AuthenticationResult: mockTokens,
        });
        cognitoClient.initiateAuth.mockResolvedValueOnce({
          AuthenticationResult: mockTokens,
        });

        const result = await service.getAccessToken(credentials, clientId);
        expect(result).toEqual(mockTokens);
        expect(cognitoClient.respondToAuthChallenge).toHaveBeenCalled();
      });

      it('should handle NotAuthorizedException', async () => {
        cognitoClient.initiateAuth.mockRejectedValue({
          name: 'NotAuthorizedException',
        });

        await expect(service.getAccessToken(credentials, clientId)).rejects.toThrow(
          UnauthorizedException
        );
      });

      it('should handle UserNotConfirmedException', async () => {
        cognitoClient.initiateAuth.mockRejectedValue({
          name: 'UserNotConfirmedException',
        });

        await expect(service.getAccessToken(credentials, clientId)).rejects.toThrow(
          UnauthorizedException
        );
      });

      it('should handle InvalidParameterException', async () => {
        cognitoClient.initiateAuth.mockRejectedValue({
          name: 'InvalidParameterException',
        });

        await expect(service.getAccessToken(credentials, clientId)).rejects.toThrow(
          BadRequestException
        );
      });
    });
  });

  describe('completeChallenge', () => {
    const challengeParams = {
      username: 'testuser',
      password: 'newpassword',
      session: 'session-token',
      clientId: 'test-client-id',
    };

    it('should handle successful challenge completion', async () => {
      cognitoClient.respondToAuthChallenge.mockResolvedValue({
        AuthenticationResult: mockTokens,
      });

      const result = await service.completeChallenge(challengeParams);
      expect(result).toEqual({ AuthenticationResult: mockTokens });
      expect(cognitoClient.respondToAuthChallenge).toHaveBeenCalledWith({
        ClientId: challengeParams.clientId,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
          USERNAME: challengeParams.username,
          NEW_PASSWORD: challengeParams.password,
        },
        Session: challengeParams.session,
      });
    });

    it('should handle NotAuthorizedException during challenge', async () => {
      cognitoClient.respondToAuthChallenge.mockRejectedValue({
        name: 'NotAuthorizedException',
      });

      await expect(service.completeChallenge(challengeParams)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should handle ExpiredCodeException during challenge', async () => {
      cognitoClient.respondToAuthChallenge.mockRejectedValue({
        name: 'ExpiredCodeException',
      });

      await expect(service.completeChallenge(challengeParams)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('verifyToken', () => {
    it('should delegate token verification to mock service',  () => {
      const token = 'test-token';
       service.verifyToken(token);
      expect(cognitoMockService.verifyToken).toHaveBeenCalledWith(token);
    });
  });
});