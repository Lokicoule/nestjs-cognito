import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { Injectable } from "@nestjs/common";
import { InjectCognitoIdentityProvider } from "../../lib";

@Injectable()
export class AppService {
  constructor(
    @InjectCognitoIdentityProvider()
    private readonly client: CognitoIdentityProvider,
  ) {}

  public getHello(): { message: string } {
    return { message: "Hello World!" };
  }
}
