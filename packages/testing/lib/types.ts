export interface MockUserConfig {
  username: string;
  email?: string;
  groups?: string[];
  attributes?: Record<string, string>;
}

export interface MockConfig {
  enabled?: boolean;
  user?: MockUserConfig;
}

export interface TokenPayload {
  sub: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  "cognito:groups": string[];
  "cognito:username": string;
  email?: string;
  email_verified: boolean;
  token_use: "access" | "id" | "refresh";
  scope?: string;
  [key: string]: unknown;
}

export interface CognitoTestingOptions {
  /** App client secret, or a function returning the current one (read on every call). */
  clientSecret?: string | (() => string | Promise<string>);
}
