import { UserBuilder } from "../../user/user.builder";
import { RequiredScopesValidator } from "./required-scopes.validator";

describe("RequiredScopesValidator", () => {
  const validator = new RequiredScopesValidator();
  const options = { requiredScopes: ["orders/read", "orders/write"] };
  const user = (scopes: string[]) =>
    new UserBuilder().setUsername("client").setScopes(scopes).build();

  it("passes when the token has every scope", () => {
    expect(
      validator.validate(
        user(["orders/read", "orders/write", "admin"]),
        options,
      ),
    ).toBe(true);
  });

  it("fails when the token misses a scope", () => {
    expect(validator.validate(user(["orders/read"]), options)).toBe(false);
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
