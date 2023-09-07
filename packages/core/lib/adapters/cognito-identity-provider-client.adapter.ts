import {
  CognitoIdentityProviderClient,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";

export class CognitoIdentityProviderClientAdapter {
  private _client: CognitoIdentityProviderClient;

  constructor(config: CognitoIdentityProviderClientConfig) {
    this._client = new CognitoIdentityProviderClient(config);
  }

  public updateConfig(config: CognitoIdentityProviderClientConfig): void {
    const updatedClient = new CognitoIdentityProviderClient(config);

    this._client.destroy();
    this._client = updatedClient;
  }

  public get client(): CognitoIdentityProviderClient {
    return this._client;
  }
}
