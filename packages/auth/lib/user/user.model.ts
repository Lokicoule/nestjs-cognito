import { UserBuilder } from "./user.builder";

export class User {
  private _username?: string;
  private _clientId?: string;
  private _email: string;
  private _groups: string[];

  constructor(builder: UserBuilder) {
    this._username = builder.username;
    this._clientId = builder.clientId;
    this._email = builder.email;
    this._groups = builder.groups ?? [];
  }

  /**
   * Get the username of the user
   * @returns {string | undefined} - The username
   */
  public get username(): string | undefined {
    return this._username;
  }

  /**
   * Get the client ID (for machine-to-machine authentication)
   * @returns {string | undefined} - The client ID
   */
  public get clientId(): string | undefined {
    return this._clientId;
  }

  /**
   * Get the email address of the user
   * @returns {string} - The email address
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Get the groups of the user
   * @returns {string[]} - The groups
   */
  public get groups(): string[] {
    return this._groups;
  }

  /**
   * Check if the user has a group
   * @param {string} group - The group
   * @returns {boolean} - True if the user has the group
   */
  public hasGroup(group: string): boolean {
    return this._groups.includes(group.toLowerCase());
  }

  /**
   * Check if the user has at least one of the required groups
   * @param {string[]} groups - The required groups
   * @returns {boolean} - True if the user has at least one of the required groups
   */
  public hasSomeGroup(groups: string[]): boolean {
    return groups.some((group) => this.hasGroup(group));
  }

  /**
   * Check if the user has the required groups
   * @param {string[]} groups - The required groups
   * @returns {boolean} - True if the user has the required groups
   */
  public hasAllGroups(groups: string[]): boolean {
    return groups.every((group) => this.hasGroup(group));
  }
}
