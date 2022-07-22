/**
 * Memoize a function
 * @param fn - The function to memoize
 * @param defaultKey - The default key to use if no key is provided
 * @return Memoized function
 */
export function memoize(
  fn: (...args) => any,
  defaultKey?: string
): (...args) => any {
  const memoized = new Map();
  return (...args) => {
    const key = args[0] || defaultKey || "default";
    if (memoized.has(key)) {
      return memoized.get(key);
    }
    const result = fn(...args);
    memoized.set(key, result);
    return result;
  };
}
