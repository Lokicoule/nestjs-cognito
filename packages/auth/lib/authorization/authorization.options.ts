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
       * The required OAuth scopes (case-sensitive), e.g. for client credentials tokens
       */
      requiredScopes?: string[];
    };
