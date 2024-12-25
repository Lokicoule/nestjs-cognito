import {
  CognitoJwtVerifier,
  InjectCognitoJwtVerifier,
} from "@nestjs-cognito/core";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY,
  COGNITO_USER_CONTEXT_PROPERTY,
} from "./user/user.constants";
import { UserMapper } from "./user/user.mapper";
import { User } from "./user/user.model";
import { IS_PUBLIC_KEY } from "./whitelist";

/**
 * Abstract guard class that implements authentication logic for routes.
 * Handles both public and protected routes with JWT verification.
 *
 * @abstract
 * @class AbstractGuard
 * @implements {CanActivate}
 */
@Injectable()
export abstract class AbstractGuard implements CanActivate {
  #jwtVerifier: CognitoJwtVerifier;
  #reflector: Reflector;

  constructor(
    @InjectCognitoJwtVerifier()
    jwtVerifier: CognitoJwtVerifier,
    reflector: Reflector,
  ) {
    this.#jwtVerifier = jwtVerifier;
    this.#reflector = reflector;
  }

  /**
   * Determines if a request can activate a route.
   * Handles authentication for both public and protected routes.
   *
   * @param {ExecutionContext} context - The execution context
   * @returns {Promise<boolean>} True if the request can activate the route, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.#isWhitelisted(context);
    const request = this.getRequest(context);

    if (!this.#hasAuthHeaders(request)) {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException("Invalid request");
    }

    try {
      const authorization = this.#getAuthorizationToken(request);
      if (!authorization) {
        throw new UnauthorizedException(
          "Missing token in Authorization header",
        );
      }

      const payload = await this.#jwtVerifier.verify(authorization);
      if (!payload || !payload["sub"]) {
        throw new UnauthorizedException("Invalid token payload");
      }

      request[COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY] = payload;
      request[COGNITO_USER_CONTEXT_PROPERTY] =
        UserMapper.fromCognitoJwtPayload(payload);

      if (!isPublic) {
        return this.onValidate(this.#getAuthenticatedUser(request));
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException("Authentication failed", {
        cause: error,
      });
    }
  }

  /**
   * Abstract method to validate the authenticated user.
   * Implementations should define specific validation logic.
   *
   * @abstract
   * @protected
   * @param {User} user - The authenticated user to validate
   * @returns {boolean} True if the user is valid, false otherwise
   */
  protected abstract onValidate(user: User): boolean;

  /**
   * Abstract method to extract the request object from the execution context.
   * Implementations should handle different types of requests (HTTP, WebSocket, etc.).
   *
   * @abstract
   * @protected
   * @param {ExecutionContext} context - The execution context
   * @returns {any} The request object
   */
  protected abstract getRequest(context: ExecutionContext): any;

  #getAuthenticatedUser(request): User {
    const user = request[COGNITO_USER_CONTEXT_PROPERTY];

    if (!Boolean(user)) {
      throw new UnauthorizedException("User is not authenticated.");
    }

    return request[COGNITO_USER_CONTEXT_PROPERTY];
  }

  #hasAuthHeaders(request): boolean {
    if (!request) {
      return false;
    }

    const headers = request.headers || request?.handshake?.headers;
    const authorization = headers?.authorization;

    return Boolean(authorization && authorization.trim());
  }

  #getAuthorizationToken(request): string | null {
    const authorization =
      request?.headers?.authorization ||
      request?.handshake?.headers?.authorization;

    if (!authorization) {
      return null;
    }

    return authorization.replace("Bearer ", "");
  }

  #isWhitelisted(context: ExecutionContext): boolean {
    const isHandlerPublic = this.#reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    const isClassPublic = this.#reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getClass(),
    );

    return isHandlerPublic || isClassPublic;
  }
}
