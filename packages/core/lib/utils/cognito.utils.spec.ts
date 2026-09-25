import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoModuleOptions } from "../interfaces/cognito-module.options";
import {
  createCognitoIdentityProviderInstance,
  createCognitoJwtVerifierInstance,
} from "./cognito.utils";

describe("CognitoUtils", () => {
  it("should get cognito identity provider instance", async () => {
    const options = {
      identityProvider: {
        region: "us-east-1",
      },
    } as CognitoModuleOptions;

    const cognitoIdentityProvider =
      createCognitoIdentityProviderInstance(options);
    expect(cognitoIdentityProvider).toBeDefined();
    expect(cognitoIdentityProvider).toBeInstanceOf(
      CognitoIdentityProviderClient,
    );
    expect(await cognitoIdentityProvider.config.region()).toBe(
      options!.identityProvider!.region,
    );
  });

  it("renews expiring credentials through the credentials provider", async () => {
    jest.useFakeTimers({ now: new Date("2026-01-01T00:00:00Z") });
    let calls = 0;
    const cognito = createCognitoIdentityProviderInstance({
      identityProvider: {
        region: "us-east-1",
        credentials: async () => ({
          accessKeyId: `key-${++calls}`,
          secretAccessKey: "secret",
          expiration: new Date(Date.now() + 60 * 60 * 1000),
        }),
      },
    });

    const cached = [
      await cognito.config.credentials(),
      await cognito.config.credentials(),
    ];
    jest.setSystemTime(new Date("2026-01-01T02:00:00Z"));
    const renewed = await cognito.config.credentials();
    jest.useRealTimers();

    expect(cached.map((c) => c.accessKeyId)).toEqual(["key-1", "key-1"]);
    expect(renewed.accessKeyId).toBe("key-2");
  });

  it("should get cognito jwt verifier single user pool instance", async () => {
    const options: CognitoModuleOptions = {
      jwtVerifier: {
        userPoolId: "us-east-1_123456789",
      },
    };

    const cognitoJwtVerifier = createCognitoJwtVerifierInstance(options);

    expect(cognitoJwtVerifier).toBeDefined();
  });

  it("should get cognito jwt verifier multi user pool instance", async () => {
    const options: CognitoModuleOptions = {
      jwtVerifier: [
        {
          userPoolId: "us-east-1_123456789",
          clientId: "123456789",
          tokenUse: "id",
        },
      ],
    };

    const cognitoJwtVerifier = createCognitoJwtVerifierInstance(options);

    expect(cognitoJwtVerifier).toBeDefined();
  });

  it("should create a CognitoIdentityProvider instance", async () => {
    const options = {
      identityProvider: {
        region: "us-east-1",
      },
    } as CognitoModuleOptions;

    const cognitoIdentityProvider =
      createCognitoIdentityProviderInstance(options);

    expect(cognitoIdentityProvider).toBeDefined();
    expect(cognitoIdentityProvider).toBeInstanceOf(
      CognitoIdentityProviderClient,
    );
    expect(await cognitoIdentityProvider.config.region()).toEqual(
      options!.identityProvider!.region,
    );
  });
});
it("should create a CognitoJwtVerifier instance with jwtVerifier", () => {
  const options: CognitoModuleOptions = {
    jwtVerifier: {
      userPoolId: "us-east-1_123456789",
    },
  };

  const cognitoJwtVerifier = createCognitoJwtVerifierInstance(options);

  expect(cognitoJwtVerifier).toBeDefined();
  expect(cognitoJwtVerifier.jwtVerifier).toBeDefined();
});

it("should create a CognitoJwtVerifier instance with jwtRsaVerifier", () => {
  const options: CognitoModuleOptions = {
    jwtRsaVerifier: {
      issuer: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_123456789",
    },
  };

  const cognitoJwtVerifier = createCognitoJwtVerifierInstance(options);

  expect(cognitoJwtVerifier).toBeDefined();
  expect(cognitoJwtVerifier.jwtRsaVerifier).toBeDefined();
});

it("should return null when neither jwtVerifier nor jwtRsaVerifier is provided", () => {
  const options: CognitoModuleOptions = {};

  const cognitoJwtVerifier = createCognitoJwtVerifierInstance(options);

  expect(cognitoJwtVerifier).toBeNull();
});
