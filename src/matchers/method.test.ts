import { MatchResult, Method, UrlMatchType } from "../types";
import { MethodMatcher } from "./method";

describe("Method", () => {
  test.each([
    {
      name: "match method",
      method: "GET",
      httpMethod: "GET",
      expectedResult: MatchResult.Match,
    },
    {
      name: "match method when any",
      method: "ANY",
      httpMethod: "PUT",
      expectedResult: MatchResult.Match,
    },
    {
      name: "match method when any",
      method: "ANY",
      httpMethod: "GET",
      expectedResult: MatchResult.Match,
    },
    {
      name: "not match method different method",
      method: "POST",
      httpMethod: "GET",
      expectedResult: MatchResult.NoMatch,
    },
    {
      name: "discard when method is undefined",
      method: undefined,
      httpMethod: "GET",
      expectedResult: MatchResult.Discard,
    },
  ])("should $name", ({ name, method, httpMethod, expectedResult }) => {
    const matcher = new MethodMatcher();

    expect(
      matcher.match(
        {
          urlType: UrlMatchType.Url,
          method: method as Method,
        },
        {
          method: httpMethod as Method,
          url: "",
          headers: [],
        },
      ),
    ).toBe(expectedResult);
  });
});
