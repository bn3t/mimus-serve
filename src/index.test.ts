import { helloWorld, helloWorldAsync, MyClass } from ".";

describe("Test index.ts", () => {
  it("should be Hello, world!", () => {
    const actual = helloWorld();
    expect(actual).toBe("Hello, world!");
  });

  it("should be Hello, world! - Async", async () => {
    const actual = await helloWorldAsync();
    expect(actual).toBe("Hello, async world!");
  });

  it("should be support properties in constructors", () => {
    const actual = new MyClass("test");
    expect(actual.type).toBe("test");
  });
});
