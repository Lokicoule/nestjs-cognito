import { CognitoIdentityProviderClientAdapter } from "./cognito-identity-provider-client.adapter";
import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";

describe("CognitoIdentityProviderClientAdapter", () => {
  const config: CognitoIdentityProviderClientConfig = {
    region: "us-east-1",
    credentials: {
      accessKeyId: "ACCESS_KEY_ID",
      secretAccessKey: "SECRET_ACCESS_KEY",
    },
  };

  let adapter: CognitoIdentityProviderClientAdapter;

  beforeEach(() => {
    adapter = new CognitoIdentityProviderClientAdapter(config);
  });

  afterEach(() => {
    adapter.client.destroy();
  });

  describe("constructor", () => {
    it("should create a new CognitoIdentityProviderClient instance", () => {
      expect(adapter.client).toBeDefined();
      expect(adapter.client).toBeInstanceOf(CognitoIdentityProviderClient);
    });
  });

  describe("updateConfig", () => {
    it("should update the client configuration", async () => {
      const updatedConfig: CognitoIdentityProviderClientConfig = {
        region: "us-west-2",
        credentials: {
          accessKeyId: "UPDATED_ACCESS_KEY_ID",
          secretAccessKey: "UPDATED_SECRET_ACCESS_KEY",
        },
      };

      adapter.updateConfig(updatedConfig);

      expect(await adapter.client.config.region()).toEqual("us-west-2");
      expect(await adapter.client.config.credentials()).toEqual({
        accessKeyId: "UPDATED_ACCESS_KEY_ID",
        secretAccessKey: "UPDATED_SECRET_ACCESS_KEY",
      });
    });
  });
});
