import type {
  CognitoJwtVerifierMultiProperties,
  CognitoJwtVerifierMultiUserPool,
  CognitoJwtVerifierProperties,
  CognitoJwtVerifierSingleUserPool,
} from "aws-jwt-verify/cognito-verifier";
import type { CognitoJwtPayload, JwtPayload } from "aws-jwt-verify/jwt-model";
import type {
  JwtRsaVerifierMultiIssuer,
  JwtRsaVerifierMultiProperties,
  JwtRsaVerifierProperties,
  JwtRsaVerifierSingleIssuer,
  VerifyProperties,
} from "aws-jwt-verify/jwt-rsa";

interface CognitoJwtVerifierProps {
  jwtVerifier?:
    | CognitoJwtVerifierSingleUserPool<CognitoJwtVerifierProperties>
    | CognitoJwtVerifierMultiUserPool<CognitoJwtVerifierMultiProperties>
    | undefined;
  JwtRsaVerifier?:
    | JwtRsaVerifierSingleIssuer<JwtRsaVerifierProperties<VerifyProperties>>
    | JwtRsaVerifierMultiIssuer<JwtRsaVerifierMultiProperties<VerifyProperties>>
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
    return this.#props.JwtRsaVerifier;
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
    if (this.#props.JwtRsaVerifier) {
      return this.#props.JwtRsaVerifier.verify(token);
    }

    throw new Error("No verifier found.");
  }
}
