import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoModuleOptions } from "../interfaces/cognito-module.options";
import {
  createCognitoIdentityProviderInstance,
  createCognitoIdentityProviderClientInstance,
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
      CognitoIdentityProviderClient
    );
    expect(await cognitoIdentityProvider.config.region()).toBe(
      options!.identityProvider!.region
    );
  });

  it("should get cognito identity provider client instance", async () => {
    const options = {
      identityProvider: {
        region: "us-east-1",
      },
    } as CognitoModuleOptions;

    const cognitoIdentityProviderClient =
      createCognitoIdentityProviderClientInstance(options);

    expect(cognitoIdentityProviderClient).toBeDefined();
    expect(cognitoIdentityProviderClient).toBeInstanceOf(
      CognitoIdentityProviderClient
    );
    expect(await cognitoIdentityProviderClient.config.region()).toEqual(
      options!.identityProvider!.region
    );
  });

  it("should get cognito jwt verifier instance", async () => {
    const options: CognitoModuleOptions = {
      jwtVerifier: {
        userPoolId: "us-east-1_123456789",
      },
    };

    const cognitoJwtVerifier = createCognitoJwtVerifierInstance(options);

    expect(cognitoJwtVerifier).toBeDefined();
  });
});
