import type { TokenUse } from "../token-use";

export type AuthorizationOptions =
  | /**  The allowed groups*/ string[]
  | {
      /**
       * The allowed groups
       */
      allowedGroups?: string[];

      /**
       * The prohibited groups
       */
      prohibitedGroups?: string[];

      /**
       * The required groups
       */
      requiredGroups?: string[];

      /**
       * The allowed OAuth scopes (case-sensitive): the token needs at least one
       */
      allowedScopes?: string[];

      /**
       * The required OAuth scopes (case-sensitive), e.g. for client credentials tokens
       */
      requiredScopes?: string[];

      /**
       * Only accept this token type
       */
      tokenUse?: TokenUse;
    };
