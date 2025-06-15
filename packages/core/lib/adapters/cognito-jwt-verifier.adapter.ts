import type {
  CognitoJwtVerifierMultiProperties,
  CognitoJwtVerifierMultiUserPool,
  CognitoJwtVerifierProperties,
  CognitoJwtVerifierSingleUserPool,
} from "aws-jwt-verify/cognito-verifier";
import type { CognitoJwtPayload, JwtPayload } from "aws-jwt-verify/jwt-model";
import type {
  JwtVerifierMultiIssuer,
  JwtVerifierMultiProperties,
  JwtVerifierProperties,
  JwtVerifierSingleIssuer,
  VerifyProperties,
} from "aws-jwt-verify/jwt-verifier";

interface CognitoJwtVerifierProps {
  jwtVerifier?:
    | CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>
    | CognitoJwtVerifierMultiUserPool<CognitoJwtVerifierMultiProperties>
    | undefined;
  jwtRsaVerifier?:
    | JwtVerifierSingleIssuer<JwtVerifierProperties<VerifyProperties>>
    | JwtVerifierMultiIssuer<JwtVerifierMultiProperties<VerifyProperties>>
    | undefined;
}

/**
 * Represents a Cognito JWT Verifier.
 */
export class CognitoJwtVerifier {
  #props: CognitoJwtVerifierProps;

  /**
   * Creates a new instance of CognitoJwtVerifier.
   * @param props - The properties for the CognitoJwtVerifier.
   */
  private constructor(props: CognitoJwtVerifierProps) {
    this.#props = props;
  }

  /**
   * Creates a new instance of CognitoJwtVerifier.
   * @param props - The properties for the CognitoJwtVerifier.
   * @returns A new instance of CognitoJwtVerifier.
   */
  static create(props: CognitoJwtVerifierProps): CognitoJwtVerifier {
    return new CognitoJwtVerifier(props);
  }

  /**
   * Gets the JWT verifier.
   * @returns The JWT verifier.
   */
  get jwtVerifier() {
    return this.#props.jwtVerifier;
  }

  /**
   * Gets the JWT RSA verifier.
   * @returns The JWT RSA verifier.
   */
  get jwtRsaVerifier() {
    return this.#props.jwtRsaVerifier;
  }

  /**
   * Verifies the given token.
   * @param token - The token to verify.
   * @returns A promise that resolves to the verification result.
   * @throws An error if no verifier is found.
   */
  verify(token: string): Promise<CognitoJwtPayload> | Promise<JwtPayload> {
    if (this.#props.jwtVerifier) {
      return this.#props.jwtVerifier.verify(token);
    }
    if (this.#props.jwtRsaVerifier) {
      return this.#props.jwtRsaVerifier.verify(token);
    }

    throw new Error("No verifier found.");
  }
}
