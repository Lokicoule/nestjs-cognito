import type { IncomingHttpHeaders } from "node:http";
import type { CognitoJwtExtractor } from "../interfaces/cognito-jwt-extractor.interface";

type HeadersRequest = {
  headers?: IncomingHttpHeaders;
  handshake?: { headers?: IncomingHttpHeaders; auth?: { token?: unknown } };
};

/**
 * Default implementation that extracts JWT tokens from the "Bearer" authorization request header.
 * Supports both HTTP requests and WebSocket handshake headers.
 */
export class BearerJwtExtractor implements CognitoJwtExtractor<HeadersRequest> {
  /**
   * Checks if the request has authentication information in the Authorization header.
   * @param request - The request object (HTTP or WebSocket)
   * @returns True if Authorization header is present and not empty
   */
  hasAuthenticationInfo(request: HeadersRequest): boolean {
    const headers = request?.headers || request?.handshake?.headers;
    const authorization = headers?.authorization;

    return Boolean(authorization?.trim() || socketAuthToken(request));
  }

  /**
   * Extracts the JWT token from the Authorization header, removing the "Bearer " prefix.
   * @param request - The request object (HTTP or WebSocket)
   * @returns The JWT token string or null if not found
   */
  getAuthorizationToken(request: HeadersRequest): string | null {
    const authorization =
      request?.headers?.authorization ||
      request?.handshake?.headers?.authorization;

    if (!authorization) {
      return socketAuthToken(request);
    }

    return authorization.replace("Bearer ", "");
  }
}

// socket.io clients in browsers can't set headers: io(url, { auth: { token } })
function socketAuthToken(request: HeadersRequest): string | null {
  const token = request?.handshake?.auth?.token;
  return typeof token === "string" ? token : null;
}
