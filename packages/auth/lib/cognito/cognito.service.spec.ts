import {
  CognitoIdentityProvider,
  GetUserResponse,
} from "@aws-sdk/client-cognito-identity-provider";
import { COGNITO_INSTANCE_TOKEN } from "@nestjs-cognito/core";
import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CognitoAuthModule } from "../cognito-auth.module";
import { UserBuilder } from "../user/user.builder";
import { CognitoService } from "./cognito.service";

describe("CognitoService", () => {
  let service: CognitoService;
  let client: CognitoIdentityProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CognitoAuthModule.register({
          region: "us-east-1",
        }),
      ],
    }).compile();
    client = module.get<CognitoIdentityProvider>(COGNITO_INSTANCE_TOKEN);
    service = module.get<CognitoService>(CognitoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("decode accessToken", () => {
    it("should check accessToken and return a user", async () => {
      const result: GetUserResponse = {
        UserAttributes: [
          {
            Name: "email",
            Value: "test@mail.com",
          },
        ],
        Username: "test",
      };
      jest.spyOn(client, "getUser").mockImplementation(() => result);

      expect(
        await service.getUser(
          "eyJraWQiOiJaZDFUc0k4cmx3eEQxNG4xV0RkMkNaZmZTWmxCc3J5Rm0rTmJIcVJBNlN3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkNGY4MmU0NS1hYjY1LTQ2Y2MtOWEwZS0wZGRkNmNmMmNiNGQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XZDVJT0JERkMiLCJjbGllbnRfaWQiOiIzcGhlYnNqNmZtYWE3cjljdW90OXM5OXY5ayIsIm9yaWdpbl9qdGkiOiIxMWE2OTc3NS1mZTY2LTQ1NmMtYTkyZS1hMzE3OTk1OWIwNjEiLCJldmVudF9pZCI6IjNmMjE1ZjkzLTc4NjgtNGNhMi1iMDgzLTcxMDFhMDk1YzUxNyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NTc0MDM2MzcsImV4cCI6MTY1NzQwNzIzNywiaWF0IjoxNjU3NDAzNjM3LCJqdGkiOiI2NWZmMjUzZi0zYWE0LTQzYzAtYjFmZi0wYmQxOTM1MDJjMTIiLCJ1c2VybmFtZSI6InVzZXJAZW1haWwuY29tIn0.mNYW48CVi2dHJxnuRlTs0bMMuij_2nYOtj895Dn6JlTfn0QhIzAR_9SG30Hcrw8JrHv8PZt_GaX_E2o7e6LH39Avpc-WxlEUXb9CeEmcYqhZHk3LGlQbjG-Dy5uAS2BcyE3YXxc7NoKbvZVUUMPf8dLbobULsofCv6acOjfCOvi0QqtTxqtKZjcYGuRKf79Z0urBU4LF0XvsS_xVxRhZAvyw6NcgLR9Y2dslitbgDaCbNglR5yhINMOsPLEZwu1sVTHXBxxxCCf6zV-8b-N6DQJw2yiP5YDVleWMtbhzIX9-TzXHCnrM3koVl7SA_VFIKNrCZeQkUKykV4AL28H-8Q"
        )
      ).toEqual(
        new UserBuilder()
          .setUsername("test")
          .setEmail("test@mail.com")
          .setGroups([])
          .build()
      );
    });

    it("should throw an error if accessToken is invalid", () => {
      const result: GetUserResponse = {
        UserAttributes: [
          {
            Name: "email",
            Value: "test@mail.com",
          },
        ],
        Username: "test",
      };
      jest.spyOn(client, "getUser").mockImplementation(() => result);

      expect(
        async () => await service.getUser("this is not an access token")
      ).rejects.toThrowError(
        new UnauthorizedException("Invalid access token.")
      );
    });
  });
});
