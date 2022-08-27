import { matchJson, matchRegexp } from "./strings";

describe("Strings", () => {
  test.each([
    { testname: "match regexp", regexp: "/.*", value: "/test", expected: true },
    {
      testname: "not match regepx",
      regexp: "/.*",
      value: "blah",
      expected: false,
    },
  ])("should $testname", ({ regexp, value, expected }) => {
    const actual = matchRegexp(regexp, value);
    expect(actual).toBe(expected);
  });

  test("should match json equals", () => {
    const actual = matchJson('{"a":    1}', '{"a":1}');
    expect(actual).toBe(true);
  });

  test("should not match json if different", () => {
    const actual = matchJson('{"a":1}', '{"a":2}');
    expect(actual).toBe(false);
  });
});
