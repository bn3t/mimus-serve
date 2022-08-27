import { MatchResult, UrlMatchType } from "../types";
import { UrlMatcher } from "./url";

describe("Url Matching", () => {
  test.each([
    {
      testname: "discard when no url specified",
      urlType: UrlMatchType.Url,
      url: undefined,
      httpUrl: "/example-url/to-match",
      expectedResult: MatchResult.Discard,
    },
    {
      testname: "match equality when on url",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match",
      httpUrl: "/example-url/to-match",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "not match equality when on url",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match",
      httpUrl: "/example-url/does-not-match",
      expectedResult: MatchResult.NoMatch,
    },
    {
      testname: "match equality when on url with parameters",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match?param=value",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "not match equality when on url with parameters",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match?param=value",
      httpUrl: "/example-url/does-not-match",
      expectedResult: MatchResult.NoMatch,
    },
    {
      testname: "match regexp when on url",
      urlType: UrlMatchType.UrlPattern,
      url: "/example-url/.*",
      httpUrl: "/example-url/to-match",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "not match equality when on url",
      urlType: UrlMatchType.UrlPattern,
      url: "/example-url/.*",
      httpUrl: "/example-url-no-match/to-match",
      expectedResult: MatchResult.NoMatch,
    },
    {
      testname: "match equality when on PATH",
      urlType: UrlMatchType.Path,
      url: "/example-url/to-match",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "not match equality when on PATH",
      urlType: UrlMatchType.Path,
      url: "/example-url/not-to-match",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.NoMatch,
    },
    {
      testname: "match regexp when on PATH",
      urlType: UrlMatchType.PathPattern,
      url: "/example-url/.*",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.Match,
    },
    {
      testname: "not match equality when on PATH",
      urlType: UrlMatchType.Path,
      url: "/example-url-not/.*",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.NoMatch,
    },
  ])(`should $testname`, ({ urlType, url, httpUrl, expectedResult }) => {
    const matcher = new UrlMatcher();

    const actual = matcher.match(
      {
        urlType,
        url,
        method: "ANY",
        queryParameters: [],
        headers: [],
        bodyPatterns: [],
      },
      {
        url: httpUrl,
        method: "GET",
        headers: [],
        body: "",
      },
    );
    expect(actual).toBe(expectedResult);
  });
});
