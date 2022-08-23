import { MatchResult, UrlMatchType } from "../types";
import { UrlMatcher } from "./url";

describe("Url Matching", () => {
  test.each([
    {
      name: "discard when no url specified",
      urlType: UrlMatchType.Url,
      url: undefined,
      httpUrl: "/example-url/to-match",
      expectedResult: MatchResult.Discard,
    },
    {
      name: "match equality when on url",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match",
      httpUrl: "/example-url/to-match",
      expectedResult: MatchResult.Match,
    },
    {
      name: "not match equality when on url",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match",
      httpUrl: "/example-url/does-not-match",
      expectedResult: MatchResult.NoMatch,
    },
    {
      name: "match equality when on url with parameters",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match?param=value",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.Match,
    },
    {
      name: "not match equality when on url with parameters",
      urlType: UrlMatchType.Url,
      url: "/example-url/to-match?param=value",
      httpUrl: "/example-url/does-not-match",
      expectedResult: MatchResult.NoMatch,
    },
    {
      name: "match regexp when on url",
      urlType: UrlMatchType.UrlPattern,
      url: "/example-url/.*",
      httpUrl: "/example-url/to-match",
      expectedResult: MatchResult.Match,
    },
    {
      name: "not match equality when on url",
      urlType: UrlMatchType.UrlPattern,
      url: "/example-url/.*",
      httpUrl: "/example-url-no-match/to-match",
      expectedResult: MatchResult.NoMatch,
    },
    {
      name: "match equality when on PATH",
      urlType: UrlMatchType.Path,
      url: "/example-url/to-match",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.Match,
    },
    {
      name: "not match equality when on PATH",
      urlType: UrlMatchType.Path,
      url: "/example-url/not-to-match",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.NoMatch,
    },
    {
      name: "match regexp when on PATH",
      urlType: UrlMatchType.PathPattern,
      url: "/example-url/.*",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.Match,
    },
    {
      name: "not match equality when on PATH",
      urlType: UrlMatchType.Path,
      url: "/example-url-not/.*",
      httpUrl: "/example-url/to-match?param=value",
      expectedResult: MatchResult.NoMatch,
    },
  ])(`should $name`, ({ name, urlType, url, httpUrl, expectedResult }) => {
    const matcher = new UrlMatcher();

    const actual = matcher.match(
      {
        urlType,
        url,
        method: "ANY",
      },
      {
        url: httpUrl,
        method: "GET",
        headers: [],
      },
    );
    expect(actual).toBe(expectedResult);
  });
});
