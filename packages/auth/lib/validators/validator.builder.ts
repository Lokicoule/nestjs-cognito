import { AbstractValidator } from "./abstract.validator";

export class ValidatorChainBuilder {
  private _first: AbstractValidator;
  private _last: AbstractValidator;

  /**
   * Gets the first validator in the chain
   * @returns {AbstractValidator} - The first validator in the chain
   */
  public build(): AbstractValidator {
    return this._first;
  }

  /**
   * Creates a new instance of the builder
   * @Returns {ValidatorChainBuilder} - The builder instance
   */
  public static create(): ValidatorChainBuilder {
    return new ValidatorChainBuilder();
  }

  /**
   * Adds a validator to the beginning of the chain if the chain is empty
   * Chains the last validator to the new validator
   * Adds a validator to the end of the chain
   * @param {AbstractValidator} validator - The validator to add to the chain
   * @returns {ValidatorChainBuilder} - The builder instance
   */
  public with(validator: AbstractValidator): ValidatorChainBuilder {
    if (!Boolean(this._first)) {
      this._first = validator;
    }
    if (Boolean(this._last)) {
      this._last.setNext(validator);
    }
    this._last = validator;
    return this;
  }
}
