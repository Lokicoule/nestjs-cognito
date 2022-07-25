import { memoize } from "./memoize.util";

describe("memoize", () => {
  it("should memo function", () => {
    const fn = jest.fn(() => "result");
    const memoizedFn = memoize(fn);
    expect(memoizedFn("input")).toBe("result");
    expect(memoizedFn("input")).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should memo function with input", () => {
    const fn = jest.fn((input: string) => `result ${input}`);
    const memoizedFn = memoize(fn);
    expect(memoizedFn("input")).toBe("result input");
    expect(memoizedFn("input")).toBe("result input");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should memo function with passed defaultKey", () => {
    const fn = jest.fn(() => "result");
    const memoizedFn = memoize(fn, "generateKey");
    expect(memoizedFn()).toBe("result");
    expect(memoizedFn()).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should memo function with built-in defaultKey", () => {
    const fn = jest.fn(() => "result");
    const memoizedFn = memoize(fn);
    expect(memoizedFn()).toBe("result");
    expect(memoizedFn()).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
