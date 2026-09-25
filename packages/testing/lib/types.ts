export interface MockUserConfig {
  username: string;
  /** Defaults to the username */
  sub?: string;
  email?: string;
  groups?: string[];
  attributes?: Record<string, string>;
  /** Access token scopes. Defaults to `aws.cognito.signin.user.admin` */
  scopes?: string[];
}

export interface MockConfig {
  enabled?: boolean;
  user?: MockUserConfig;
  /** Token lifetime in seconds (default 3600). A negative value issues expired tokens */
  expiresIn?: number;
}

export interface TokenPayload {
  sub: string;
  iss: string;
  exp: number;
  iat: number;
  token_use: "access" | "id";
  "cognito:groups"?: string[];
  [key: string]: unknown;
}

export interface CognitoTestingOptions {
  /** App client secret, or a function returning the current one (read on every call). */
  clientSecret?: string | (() => string | Promise<string>);
}
