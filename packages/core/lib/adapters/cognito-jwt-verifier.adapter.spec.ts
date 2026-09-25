import {
  CognitoJwtVerifier as AwsCognitoJwtVerifier,
  JwtVerifier as JwtRsaVerifier,
} from "aws-jwt-verify";
import { CognitoJwtVerifier } from "./cognito-jwt-verifier.adapter";

describe("CognitoJwtVerifier.hydrate", () => {
  it("hydrates the Cognito verifier", async () => {
    const jwtVerifier = AwsCognitoJwtVerifier.create({
      userPoolId: "us-east-1_abc123",
      clientId: null,
      tokenUse: "id",
    });
    const hydrate = jest.spyOn(jwtVerifier, "hydrate").mockResolvedValue();

    await CognitoJwtVerifier.create({ jwtVerifier }).hydrate();

    expect(hydrate).toHaveBeenCalledTimes(1);
  });

  it("hydrates the RSA verifier", async () => {
    const jwtRsaVerifier = JwtRsaVerifier.create({
      issuer: "https://issuer.example.com",
      audience: null,
      jwksUri: "https://issuer.example.com/.well-known/jwks.json",
    });
    const hydrate = jest.spyOn(jwtRsaVerifier, "hydrate").mockResolvedValue();

    await CognitoJwtVerifier.create({ jwtRsaVerifier }).hydrate();

    expect(hydrate).toHaveBeenCalledTimes(1);
  });
});
