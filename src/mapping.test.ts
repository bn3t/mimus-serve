import { findMapping, parseOne, parseUrl } from "./mapping";
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
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/discard",
      method: "GET",
    },
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 01",
    },
  },
  {
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-02",
      method: "GET",
    },
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 02",
    },
  },
  {
    priority: 10,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-01",
      method: "GET",
    },
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 01",
    },
  },
];

describe("Find Mapping", () => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const TEST_JSON_MAPPING_PARSE_ONE = {
  priority: 1000,
  request: {
    urlPath: "/everything",
    method: "ANY",
    headers: {
      Accept: {
        contains: "xml",
      },
    },
    queryParameters: {
      search_term: {
        equalTo: "WireMock",
      },
    },
    cookies: {
      session: {
        matches: ".*12345.*",
      },
    },
    bodyPatterns: [
      {
        equalToXml: "<search-results />",
      },
      {
        matchesXPath: "//search-results",
      },
    ],
    multipartPatterns: [
      {
        matchingType: "ANY",
        headers: {
          "Content-Disposition": {
            contains: 'name="info"',
          },
          "Content-Type": {
            contains: "charset",
          },
        },
        bodyPatterns: [
          {
            equalToJson: "{}",
          },
        ],
      },
    ],
    basicAuthCredentials: {
      username: "jeff@example.com",
      password: "jeffteenjefftyjeff",
    },
  },
  response: {
    status: 200,
    statusMessage: "Everything was just fine!",
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
    body: "Text body",
  },
};

describe("Parse mapping", () => {
  test("should parse oone", () => {
    const actual = parseOne(TEST_JSON_MAPPING_PARSE_ONE);

    expect(actual).toBeDefined();
    expect(actual.priority).toBe(1000);
    expect(actual.requestMatch).toBeDefined();
    expect(actual.requestMatch.method).toBe("ANY");
    expect(actual.requestMatch.url).toBe("/everything");
    expect(actual.requestMatch.urlType).toBe(UrlMatchType.Path);
    expect(actual.responseDefinition).toBeDefined();
    expect(actual.responseDefinition.status).toBe(200);
    expect(actual.responseDefinition.body).toBe("Text body");
    expect(actual.responseDefinition.statusMessage).toBe(
      "Everything was just fine!",
    );
    expect(actual.responseDefinition.headers).toStrictEqual([
      { name: "Content-Type", value: "text/plain" },
      { name: "Cache-Control", value: "no-cache" },
    ]);
  });

  test.each([
    {
      name: "Parse Url",
      request: {
        url: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.Url,
      },
    },
    {
      name: "Parse UrlPattern",
      request: {
        urlPattern: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.UrlPattern,
      },
    },
    {
      name: "Parse Path",
      request: {
        urlPath: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.Path,
      },
    },
    {
      name: "Parse PathPattern",
      request: {
        urlPathPattern: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.PathPattern,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ])("should parse url $name", ({ name, request, expected }) => {
    const actual = parseUrl(request);
    expect(actual).toBeDefined();
    expect(actual?.url).toBe(expected.url);
    expect(actual?.urlType).toBe(expected.urlType);
  });
});
