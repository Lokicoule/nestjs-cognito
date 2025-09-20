import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoModuleOptions } from "../interfaces/cognito-module.options";
import {
  createCognitoIdentityProviderInstance,
  createCognitoJwtVerifierInstance,
  parseCookies,
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

describe("parseCookies", () => {
  it("should parse cookies", () => {
    const cookies = "foo=bar; baz=qux";

    const parsedCookies = parseCookies(cookies);

    expect(parsedCookies).toEqual({ foo: "bar", baz: "qux" });
  });

  it("should return an empty object when no cookies are provided", () => {
    const parsedCookies = parseCookies();
    expect(parsedCookies).toEqual({});
  });
});
