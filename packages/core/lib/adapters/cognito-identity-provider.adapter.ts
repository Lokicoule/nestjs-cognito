import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClientConfig,
} from "@aws-sdk/client-cognito-identity-provider";

export class CognitoIdentityProviderAdapter {
  private _client: CognitoIdentityProvider;

  constructor(config: CognitoIdentityProviderClientConfig) {
    this._client = new CognitoIdentityProvider(config);
  }

  public updateConfig(config: CognitoIdentityProviderClientConfig): void {
    const updatedClient = new CognitoIdentityProvider(config);

    this._client.destroy();
    this._client = updatedClient;
  }

  public get client(): CognitoIdentityProvider {
    return this._client;
  }
}
