import { CognitoJwtExtractor } from "../interfaces/cognito-jwt-extractor.interface";

/**
 * JWT extractor implementation that extracts tokens from HTTP-only cookies.
 * Useful for web applications that store JWT tokens in secure cookies instead of headers.
 * 
 * @example
 * ```typescript
 * // Usage in module configuration
 * CognitoModule.register({
 *   jwtExtractor: new CookieJwtExtractor('access_token'),
 *   // ... other options
 * })
 * ```
 */
export class CookieJwtExtractor implements CognitoJwtExtractor {
  private readonly cookieName: string;

  /**
   * Creates a new cookie-based JWT extractor.
   * @param cookieName - The name of the cookie containing the JWT token. Defaults to 'access_token'
   */
  constructor(cookieName: string = 'access_token') {
    this.cookieName = cookieName;
  }

  /**
   * Checks if the request has authentication information in the specified cookie.
   * @param request - The request object (must have cookies property)
   * @returns True if the cookie is present and not empty
   */
  hasAuthenticationInfo(request: any): boolean {
    const cookies = request.cookies || {};
    const token = cookies[this.cookieName];

    return Boolean(token && token.trim());
  }

  /**
   * Extracts the JWT token from the specified cookie.
   * @param request - The request object (must have cookies property)
   * @returns The JWT token string or null if not found
   */
  getAuthorizationToken(request: any): string | null {
    const cookies = request.cookies || {};
    const token = cookies[this.cookieName];

    if (!token || !token.trim()) {
      return null;
    }

    return token.trim();
  }
}