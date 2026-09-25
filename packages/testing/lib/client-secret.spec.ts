import { COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { Test } from "@nestjs/testing";
import { createHmac } from "node:crypto";
import { CognitoTestingModule } from "./cognito-testing.module";
import { CognitoTestingService } from "./cognito-testing.service";
import type { CognitoTestingOptions } from "./types";

const clientId = "client-id";
const credentials = { username: "john", password: "Passw0rd!" };
const hash = (secret: string) =>
  createHmac("sha256", secret)
    .update(credentials.username + clientId)
    .digest("base64");

async function setup(options?: CognitoTestingOptions) {
  const client = {
    initiateAuth: jest.fn().mockResolvedValue({ AuthenticationResult: {} }),
    respondToAuthChallenge: jest.fn().mockResolvedValue({}),
  };
  const moduleRef = await Test.createTestingModule({
    imports: [
      CognitoTestingModule.register(
        { identityProvider: { region: "us-east-1" } },
        undefined,
        options,
      ),
    ],
  })
    .overrideProvider(COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN)
    .useValue(client)
    .compile();

  return { client, service: moduleRef.get(CognitoTestingService) };
}

describe("clientSecret", () => {
  it("sends no SECRET_HASH without a client secret", async () => {
    const { client, service } = await setup();

    await service.getAccessToken(credentials, clientId);

    expect(client.initiateAuth.mock.calls[0][0].AuthParameters).toEqual({
      USERNAME: "john",
      PASSWORD: "Passw0rd!",
    });
  });

  it("sends the SECRET_HASH of a static secret", async () => {
    const { client, service } = await setup({ clientSecret: "s1" });

    await service.getAccessToken(credentials, clientId);

    expect(
      client.initiateAuth.mock.calls[0][0].AuthParameters.SECRET_HASH,
    ).toBe(hash("s1"));
  });

  it("reads a secret provider on every call, so rotated secrets apply", async () => {
    const secrets = ["s1", "s2"];
    const { client, service } = await setup({
      clientSecret: async () => secrets.shift()!,
    });

    await service.getAccessToken(credentials, clientId);
    await service.getAccessToken(credentials, clientId);

    const sent = client.initiateAuth.mock.calls.map(
      ([request]) => request.AuthParameters.SECRET_HASH,
    );
    expect(sent).toEqual([hash("s1"), hash("s2")]);
  });

  it("sends the SECRET_HASH when completing a new password challenge", async () => {
    const { client, service } = await setup({ clientSecret: "s1" });

    await service.completeChallenge({
      ...credentials,
      session: "session",
      clientId,
    });

    expect(
      client.respondToAuthChallenge.mock.calls[0][0].ChallengeResponses
        .SECRET_HASH,
    ).toBe(hash("s1"));
  });
});
