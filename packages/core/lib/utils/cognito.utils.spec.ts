import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  createCognitoIdentityProviderInstance,
  createCognitoIdentityProviderClientInstance,
} from "./cognito.utils";

describe("CognitoUtils", () => {
  it("should get cognito identity provider instance", async () => {
    const options: CognitoIdentityProviderClientConfig = {
      region: "us-east-1",
    };

    const cognitoIdentityProvider =
      createCognitoIdentityProviderInstance(options);
    expect(cognitoIdentityProvider).toBeDefined();
    expect(cognitoIdentityProvider).toBeInstanceOf(
      CognitoIdentityProviderClient
    );
    expect(await cognitoIdentityProvider.config.region()).toBe(options.region);
  });

  it("should get cognito identity provider client instance", async () => {
    const options: CognitoIdentityProviderClientConfig = {
      region: "us-east-1",
    };

    const cognitoIdentityProviderClient =
      createCognitoIdentityProviderClientInstance(options);

    expect(cognitoIdentityProviderClient).toBeDefined();
    expect(cognitoIdentityProviderClient).toBeInstanceOf(
      CognitoIdentityProviderClient
    );
    expect(await cognitoIdentityProviderClient.config.region()).toEqual(
      options.region
    );
  });
});
