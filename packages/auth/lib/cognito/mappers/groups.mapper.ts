export class GroupsMapper {
  /**
   * Map Cognito groups to user groups.
   * @param {null | Record<string, any> | string} payload
   * @returns {string[]}
   */
  public static fromDecodedJwt(
    payload: null | Record<string, any> | string
  ): string[] {
    if (!Boolean(payload) || typeof payload === "string") {
      return [];
    }
    return payload["cognito:groups"] ?? [];
  }
}
