// Type-level check that existing consumer code (including `any`) keeps compiling.
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BearerJwtExtractor,
  CognitoJwtExtractor,
  CognitoModuleAsyncOptions,
  CookieJwtExtractor,
} from "@nestjs-cognito/core";
import { ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { AbstractGuard } from "./abstract.guard";
import { memoize } from "./utils/memoize.util";

class AnyRequestExtractor implements CognitoJwtExtractor {
  hasAuthenticationInfo(request: any) {
    return Boolean(request.headers["x-token"]);
  }
  getAuthorizationToken(request: any) {
    return request.headers["x-token"];
  }
}

class ExpressExtractor implements CognitoJwtExtractor<Request> {
  hasAuthenticationInfo(request: Request) {
    return Boolean(request.header("x-token"));
  }
  getAuthorizationToken(request: Request) {
    return request.header("x-token") ?? null;
  }
}

class ExpressGuard extends AbstractGuard {
  protected getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }
  protected onValidate(): boolean {
    return true;
  }
}

const asyncOptions: CognitoModuleAsyncOptions = {
  inject: ["CONFIG"],
  useFactory: (config: { userPoolId: string }) => ({
    jwtVerifier: {
      userPoolId: config.userPoolId,
      clientId: null,
      tokenUse: "id",
    },
  }),
};

describe("public types", () => {
  it("accept existing consumer code", () => {
    const extractors: CognitoJwtExtractor[] = [
      new AnyRequestExtractor(),
      new ExpressExtractor(),
      new BearerJwtExtractor(),
      new CookieJwtExtractor(),
    ];
    const bearer = new BearerJwtExtractor();

    expect(extractors).toHaveLength(4);
    expect(ExpressGuard).toBeDefined();
    expect(asyncOptions.useFactory).toBeDefined();
    expect(
      bearer.getAuthorizationToken({
        handshake: { headers: { authorization: "Bearer t" } },
      }),
    ).toBe("t");
  });

  it("memoize preserves the wrapped function type", () => {
    const double = memoize((n: number) => n * 2);
    const result: number = double(2);

    expect(result).toBe(4);
  });
});
