import { matchRegexp } from "./strings";

describe("Strings", () => {
  test.each([
    { testname: "match regepx", regexp: "/.*", value: "/test", expected: true },
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
});
