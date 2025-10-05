import { parseCookies } from "./parse-cookies.util";

describe("parseCookies", () => {
  it("should parse simple cookies", () => {
    expect(parseCookies("foo=bar; baz=qux")).toEqual({ foo: "bar", baz: "qux" });
  });

  it("should return an empty object when no cookies are provided", () => {
    expect(parseCookies()).toEqual({});
  });

  it("should handle cookies with = in the value and decode special characters", () => {
    const cookies = "token=eyJhbG=; name=John%20Doe; data=%7B%22x%22%3A1%7D";
    const parsed = parseCookies(cookies);

    expect(parsed.token).toBe("eyJhbG=");
    expect(parsed.name).toBe("John Doe");
    expect(parsed.data).toBe('{"x":1}');
  });
});
