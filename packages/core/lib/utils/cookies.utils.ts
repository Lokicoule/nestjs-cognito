/**
 * Parse a cookie string into a key-value object
 * @param cookies - The cookie string to parse (e.g., "foo=bar; baz=qux")
 * @returns A record of cookie names to values
 * @example
 * parseCookies("token=abc123; userId=42") // { token: "abc123", userId: "42" }
 */
export const parseCookies = (cookies?: string): Record<string, string> => {
  if (!cookies) return {};

  return cookies.split(";").reduce((acc, cookie) => {
    const [key, ...valueParts] = cookie.split("=");
    const value = valueParts.join("=")?.trim();

    if (key) {
      acc[key.trim()] = decodeURIComponent(value || '');
    }

    return acc;
  }, {});
};