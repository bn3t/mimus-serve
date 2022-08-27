import { MatchResult, Method, UrlMatchType } from "../types";
import { MethodMatcher } from "./method";

describe("Method", () => {
  test.each([
    {
      testname: "match method",
      method: "GET",
      httpMethod: "GET",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "match method when any",
      method: "ANY",
      httpMethod: "PUT",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "match method when any",
      method: "ANY",
      httpMethod: "GET",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "not match method different method",
      method: "POST",
      httpMethod: "GET",
      expectedResult: MatchResult.NoMatch,
    },
    {
      testname: "discard when method is undefined",
      method: undefined,
      httpMethod: "GET",
      expectedResult: MatchResult.Discard,
    },
  ])("should $testname", ({ method, httpMethod, expectedResult }) => {
    const matcher = new MethodMatcher();

    expect(
      matcher.match(
        {
          urlType: UrlMatchType.Url,
          method: method as Method,
          queryParameters: [],
          headers: [],
          bodyPatterns: [],
        },
        {
          method: httpMethod as Method,
          url: "",
          headers: [],
          body: "",
        },
      ),
    ).toBe(expectedResult);
  });
});
