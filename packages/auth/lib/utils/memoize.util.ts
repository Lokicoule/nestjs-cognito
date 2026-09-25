/**
 * Memoize a function
 * @param fn - The function to memoize
 * @param defaultKey - The default key to use if no key is provided
 * @return Memoized function
 */
export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  defaultKey?: string,
): (...args: A) => R {
  const memoized = new Map<unknown, R>();
  return (...args: A) => {
    const key = args[0] || defaultKey || "default";
    if (memoized.has(key)) {
      return memoized.get(key);
    }
    const result = fn(...args);
    memoized.set(key, result);
    return result;
  };
}
