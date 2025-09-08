import type { CognitoJwtExtractor } from "../interfaces/cognito-jwt-extractor.interface";

/**
 * Default implementation that extracts JWT tokens from the "Bearer" authorization request header.
 * Supports both HTTP requests and WebSocket handshake headers.
 */
export class BearerJwtExtractor implements CognitoJwtExtractor {
  /**
   * Checks if the request has authentication information in the Authorization header.
   * @param request - The request object (HTTP or WebSocket)
   * @returns True if Authorization header is present and not empty
   */
  hasAuthenticationInfo(request: any): boolean {
    const headers = request.headers || request?.handshake?.headers;
    const authorization = headers?.authorization;

    return Boolean(authorization && authorization.trim());
  }

  /**
   * Extracts the JWT token from the Authorization header, removing the "Bearer " prefix.
   * @param request - The request object (HTTP or WebSocket)
   * @returns The JWT token string or null if not found
   */
  getAuthorizationToken(request: any): string | null {
    const authorization =
      request?.headers?.authorization ||
      request?.handshake?.headers?.authorization;

    if (!authorization) {
      return null;
    }

    return authorization.replace("Bearer ", "");
  }
}