import { UserBuilder } from "../../user/user.builder";
import { AllowedScopesValidator } from "./allowed-scopes.validator";

describe("AllowedScopesValidator", () => {
  const validator = new AllowedScopesValidator();
  const options = { allowedScopes: ["orders/read", "orders/write"] };
  const user = (scopes: string[]) =>
    new UserBuilder().setUsername("client").setScopes(scopes).build();

  it("passes when the token has one of the scopes", () => {
    expect(validator.validate(user(["orders/write", "admin"]), options)).toBe(
      true,
    );
  });

  it("fails when the token has none of the scopes", () => {
    expect(validator.validate(user(["orders/admin"]), options)).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(
      validator.validate(user(["Orders/Read", "Orders/Write"]), options),
    ).toBe(false);
  });

  it("passes when the option is not set", () => {
    expect(validator.validate(user([]), {})).toBe(true);
    expect(validator.validate(user([]), ["admin"])).toBe(true);
  });
});
