import {
  type CognitoJwtExtractor,
  type CognitoJwtPayload,
  CognitoJwtVerifier,
  InjectCognitoJwtExtractor,
  InjectCognitoJwtVerifier,
} from "@nestjs-cognito/core";
import {
  BadRequestException,
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
import { CognitoTokenTypeMismatchError } from "./errors/cognito-token-type-mismatch.error";
import { TOKEN_USE_KEY, TokenUse } from "./token-use";
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
  #jwtExtractor: CognitoJwtExtractor;
  #reflector: Reflector;

  constructor(
    @InjectCognitoJwtVerifier()
    jwtVerifier: CognitoJwtVerifier,
    reflector: Reflector,
    @InjectCognitoJwtExtractor()
    jwtExtractor: CognitoJwtExtractor,
  ) {
    this.#jwtVerifier = jwtVerifier;
    this.#jwtExtractor = jwtExtractor;
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
    const request = this.getRequest(context) as Record<string, unknown>;

    if (!this.#jwtExtractor.hasAuthenticationInfo(request)) {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException("No authentication credentials provided");
    }

    try {
      const authorization = this.#jwtExtractor.getAuthorizationToken(request);
      if (!authorization) {
        throw new BadRequestException("Missing token in Authorization header");
      }

      const payload = (await this.#jwtVerifier.verify(
        authorization,
      )) as CognitoJwtPayload;

      if (!payload || !payload["sub"]) {
        throw new BadRequestException("Invalid token payload");
      }

      const tokenUse = this.#reflector.getAllAndOverride<TokenUse>(
        TOKEN_USE_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (tokenUse && payload.token_use !== tokenUse) {
        throw new CognitoTokenTypeMismatchError(tokenUse, payload.token_use);
      }

      request[COGNITO_JWT_PAYLOAD_CONTEXT_PROPERTY] = payload;
      request[COGNITO_USER_CONTEXT_PROPERTY] =
        UserMapper.fromCognitoJwtPayload(payload);

      if (!isPublic) {
        return this.onValidate(this.#getAuthenticatedUser(request));
      }

      return true;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof CognitoTokenTypeMismatchError
      ) {
        throw error;
      }

      throw new UnauthorizedException("Authentication failed", {
        cause: error as Error,
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
   * @returns {object} The request object
   */
  protected abstract getRequest(context: ExecutionContext): object;

  #getAuthenticatedUser(request: Record<string, unknown>): User {
    const user = request[COGNITO_USER_CONTEXT_PROPERTY] as User | undefined;

    if (!user) {
      throw new UnauthorizedException("User is not authenticated.");
    }

    return user;
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
