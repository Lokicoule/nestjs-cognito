import type { CognitoJwtPayload } from "@nestjs-cognito/core";
import { UserBuilder } from "./user.builder";

export class User {
  private _username?: string;
  private _clientId?: string;
  private _email: string;
  private _groups: string[];
  private _scopes: string[];
  private _payload?: CognitoJwtPayload;

  constructor(builder: UserBuilder) {
    this._username = builder.username;
    this._clientId = builder.clientId;
    this._email = builder.email;
    this._groups = builder.groups ?? [];
    this._scopes = builder.scopes ?? [];
    this._payload = builder.payload;
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
  public get sub(): string | undefined {
    return this._payload?.sub;
  }

  public get payload(): CognitoJwtPayload | undefined {
    return this._payload;
  }

  public get scopes(): string[] {
    return this._scopes;
  }

  public hasAllScopes(scopes: string[]): boolean {
    return scopes.every((scope) => this._scopes.includes(scope));
  }

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
