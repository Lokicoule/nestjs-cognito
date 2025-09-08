/**
 * Interface for custom JWT token extraction from requests.
 * Allows flexibility in how JWT tokens are retrieved from different sources
 * (headers, cookies, query parameters, etc.).
 */
export interface CognitoJwtExtractor {
  /**
   * Determines if the request contains authentication information.
   * @param request - The request object (HTTP, WebSocket, etc.)
   * @returns True if authentication info is present, false otherwise
   */
  hasAuthenticationInfo(request: any): boolean;

  /**
   * Extracts the JWT token from the request.
   * @param request - The request object (HTTP, WebSocket, etc.)
   * @returns The JWT token string or null if not found
   */
  getAuthorizationToken(request: any): string | null;
}