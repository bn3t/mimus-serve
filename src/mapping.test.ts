import { findMapping } from "./mapping";
import {
  Mapping,
  UrlMatchType,
  RequestMatcher,
  RequestMatch,
  HttpRequest,
  MatchResult,
} from "./types";

const TEST_MAPPINGS: Mapping[] = [
  {
    priority: 10,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/discard",
        method: "GET",
      },
    ],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 01",
    },
  },
  {
    priority: 0,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/url-to-match-method-02",
        method: "GET",
      },
    ],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 02",
    },
  },
  {
    priority: 10,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/url-to-match-method-01",
        method: "GET",
      },
    ],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 01",
    },
  },
];

describe("Mapping", () => {
  class TestMatcher implements RequestMatcher {
    match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
      if (httpRequest.url === "/discard") {
        return MatchResult.Discard;
      }
      return httpRequest.url === "/url-to-match-method-02"
        ? MatchResult.Match
        : MatchResult.NoMatch;
    }
  }

  test.each([
    {
      name: "find get mapping",
      url: "/url-to-match-method-02",
      expectedBody: "match 02",
    },
  ])(`should $name`, ({ name, url, expectedBody }) => {
    const request: HttpRequest = {
      method: "GET",
      url,
      headers: [],
    };
    const actual = findMapping([new TestMatcher()], TEST_MAPPINGS, request);

    expect(actual).toBeDefined();
    expect(actual?.responseDefinition.body).toBe(expectedBody);
  });
});
