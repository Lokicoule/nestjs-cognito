import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { Injectable } from "@nestjs/common";
import {
  InjectCognitoIdentityProvider,
  InjectCognitoIdentityProviderClient,
} from "../../lib";

@Injectable()
export class AppService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
    @InjectCognitoIdentityProviderClient()
    private readonly providerClient: CognitoIdentityProviderClient
  ) {}

  public getHello(): { message: string } {
    return { message: "Hello World!" };
  }
}
