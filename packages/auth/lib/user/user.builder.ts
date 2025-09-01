import { User } from "./user.model";

export class UserBuilder {
  private _username?: string;
  private _clientId?: string;
  private _email: string | null;
  private _groups: string[];

  /**
   * Get the username of the user
   * @returns {string | undefined} - The username
   */
  public get username() {
    return this._username;
  }

  /**
   * Set the username of the user
   * @param {string} username - The username
   */
  public setUsername(username: string) {
    this._username = username.toLowerCase();
    return this;
  }

  /**
   * Get the client ID
   * @returns {string | undefined} - The client ID
   */
  public get clientId() {
    return this._clientId;
  }

  /**
   * Set the client ID for machine-to-machine authentication
   * @param {string} clientId - The client ID
   */
  public setClientId(clientId: string) {
    this._clientId = clientId;
    return this;
  }

  /**
   * Get the email of the user
   * @returns {string} - The email address
   */
  public get email() {
    return this._email;
  }

  /**
   * Set the email address of the user
   * @param {string} email - The email address
   */
  public setEmail(email: string | null) {
    this._email = email?.toLowerCase();
    return this;
  }

  /**
   * Get the groups of the user
   */
  public get groups() {
    return this._groups;
  }

  /**
   * Set the groups of the user and lowercase them to make them case insensitive
   * @param {string[]} groups - The groups
   */
  public setGroups(groups: string[]) {
    this._groups = groups?.map((group) => group?.toLowerCase());
    return this;
  }

  public build(): User {
    return new User(this);
  }
}
