import {
  HttpRequest,
  Mapping,
  MatchResult,
  RequestMatch,
  RequestMatcher,
  UrlMatchType,
} from "../types";
import { listFilesInDir, readJsonFile } from "../utils/files";
import {
  findMapping,
  loadMappings,
  parseOne,
  parseUrl,
  transformScenarioWithState,
} from "./mapping";
import { Runtime } from "./runtime";

const TEST_MAPPINGS: Mapping[] = [
  {
    id: "51111A10-9016-4426-93D8-9C7C5897707F",
    priority: 10,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/discard",
      method: "GET",
      queryParameters: [],
      headers: [],
      cookies: [],
      bodyPatterns: [],
    },
    processing: [],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 01",
      fixedDelayMilliseconds: 0,
      transform: false,
    },
  },
  {
    id: "51111A10-9016-4426-93D8-9C7C5897707F",
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-02",
      method: "GET",
      queryParameters: [],
      headers: [],
      cookies: [],
      bodyPatterns: [],
    },
    processing: [],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 02",
      fixedDelayMilliseconds: 0,
      transform: false,
    },
  },
  {
    id: "51111A10-9016-4426-93D8-9C7C5897707F",
    priority: 10,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-01",
      method: "GET",
      queryParameters: [],
      headers: [],
      cookies: [],
      bodyPatterns: [],
    },
    processing: [],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 01",
      fixedDelayMilliseconds: 0,
      transform: false,
    },
  },
  {
    id: "51111A10-9016-4426-93D8-9C7C5897707E",
    scenarioName: "scenario-01",
    requiredScenarioState: "Started",
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-scenario-01",
      method: "GET",
      queryParameters: [],
      headers: [],
      cookies: [],
      bodyPatterns: [],
    },
    processing: [],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "scenario-01 in Started",
      fixedDelayMilliseconds: 0,
      transform: false,
    },
  },
  {
    id: "51111A10-9016-4426-93D8-9C7C5897707C",
    scenarioName: "scenario-01",
    requiredScenarioState: "Finished",
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-scenario-01",
      method: "GET",
      queryParameters: [],
      headers: [],
      cookies: [],
      bodyPatterns: [],
    },
    processing: [],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "scenario-01 in Finished",
      fixedDelayMilliseconds: 0,
      transform: false,
    },
  },
];

describe("Find Mapping", () => {
  class TestMatcher implements RequestMatcher {
    match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
      if (httpRequest.url === "/discard") {
        return MatchResult.Discard;
      }
      return requestMatch.url === httpRequest.url
        ? MatchResult.Match
        : MatchResult.NoMatch;
    }
  }

  test.each([
    {
      testname: "find get mapping",
      url: "/url-to-match-method-02",
      expectedBody: "match 02",
    },
    {
      testname: "find get mapping - with a scenario in Started",
      url: "/url-scenario-01",
      expectedBody: "scenario-01 in Started",
    },
    {
      testname: "find get mapping - with a scenario - in Finished",
      url: "/url-scenario-01",
      expectedBody: "scenario-01 in Finished",
      requiredScenarioState: "Finished",
    },
  ])(`should $testname`, ({ url, requiredScenarioState, expectedBody }) => {
    const request: HttpRequest = {
      method: "GET",
      url,
      headers: [],
      cookies: [],
      body: "",
    };
    const runtime = new Runtime(
      new Map([["scenario-01", ["Started", "Finished"]]]),
      new Map<string, any>(),
    );
    if (requiredScenarioState !== undefined) {
      runtime.changeScenarioState("scenario-01", requiredScenarioState);
    }
    const actual = findMapping(
      [new TestMatcher()],
      TEST_MAPPINGS,
      runtime,
      request,
    );

    expect(actual).toBeDefined();
    expect(actual?.responseDefinition.body).toBe(expectedBody);
  });
});

const TEST_JSON_MAPPING_PARSE_ONE = {
  id: "51111A10-9016-4426-93D8-9C7C5897707F",
  name: "this is a name",
  priority: 1000,
  scenarioName: "A scenario name",
  requiredScenarioState: "A required scenario state",
  newScenarioState: "A new scenario state",
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
    fixedDelayMilliseconds: 123,
  },
  processing: [
    {
      type: "input",
      dataset: "tickets",
      expression: "$",
    },
    {
      type: "match",
      expression: "$",
      output: "output",
    },
    {
      type: "store",
      operation: "replaceWithBody",
      input: "input",
      output: "output",
    },
  ],
};

describe("Parse mapping", () => {
  test("should parse one", () => {
    const actual = parseOne(TEST_JSON_MAPPING_PARSE_ONE);

    expect(actual).toBeDefined();
    expect(actual.priority).toBe(1000);
    expect(actual.id).toBe("51111a10-9016-4426-93d8-9c7c5897707f");
    expect(actual.name).toBe("this is a name");
    expect(actual.scenarioName).toBe("A scenario name");
    expect(actual.requiredScenarioState).toBe("A required scenario state");
    expect(actual.newScenarioState).toBe("A new scenario state");
    expect(actual.requestMatch).toBeDefined();
    expect(actual.requestMatch.method).toBe("ANY");
    expect(actual.requestMatch.url).toBe("/everything");
    expect(actual.requestMatch.urlType).toBe(UrlMatchType.Path);

    expect(actual.requestMatch.queryParameters).toBeDefined();
    expect(actual.requestMatch.queryParameters.length).toBe(1);
    expect(actual.requestMatch.queryParameters[0]).toStrictEqual({
      caseInsensitive: false,
      name: "search_term",
      operator: "equalTo",
      value: "WireMock",
    });
    expect(actual.requestMatch.headers).toBeDefined();
    expect(actual.requestMatch.headers.length).toBe(1);
    expect(actual.requestMatch.headers[0]).toStrictEqual({
      caseInsensitive: false,
      name: "accept",
      operator: "contains",
      value: "xml",
    });

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
    expect(actual.responseDefinition.fixedDelayMilliseconds).toBe(123);

    expect(actual.processing).toBeDefined();
    expect(actual.processing.length).toBe(3);
    expect(actual.processing[0]).toStrictEqual({
      type: "input",
      dataset: "tickets",
      expression: "$",
      groqExpression: undefined,
    });
    expect(actual.processing[1]).toStrictEqual({
      type: "match",
      expression: "$",
      groqExpression: undefined,
      output: "output",
    });
    expect(actual.processing[2]).toStrictEqual({
      type: "store",
      operation: "replaceWithBody",
      input: "input",
      match: undefined,
      output: "output",
    });
  });

  test.each([
    {
      testname: "Parse Url",
      request: {
        url: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.Url,
      },
    },
    {
      testname: "Parse UrlPattern",
      request: {
        urlPattern: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.UrlPattern,
      },
    },
    {
      testname: "Parse Path",
      request: {
        urlPath: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.Path,
      },
    },
    {
      testname: "Parse PathPattern",
      request: {
        urlPathPattern: "/everything",
      },
      expected: {
        url: "/everything",
        urlType: UrlMatchType.PathPattern,
      },
    },
    {
      testname: "Parse PathParams",
      request: {
        urlPathParams: "/test/:id",
      },
      expected: {
        url: "/test/:id",
        urlType: UrlMatchType.PathParams,
      },
    },
  ])("should parse url $testname", ({ request, expected }) => {
    const actual = parseUrl(request);
    expect(actual).toBeDefined();
    expect(actual?.url).toBe(expected.url);
    expect(actual?.urlType).toBe(expected.urlType);
  });
});

// mock listFilesInDir to return an empty array
jest.mock("../utils/files", () => ({
  listFilesInDir: jest.fn().mockImplementation((dir: string) => {
    if (dir !== "a-dir") {
      throw new Error("Unexpected dir: " + dir);
    }
    return ["a-file.json"];
  }),
  // mock readJsonFile to return a mock response definition
  readJsonFile: jest.fn().mockImplementation((file: string) => {
    if (file !== "a-file.json") {
      throw new Error("Unexpected file");
    }

    return {
      priority: 1000,
      request: {
        urlPathPattern: "/.*",
        method: "ANY",
      },
      response: {
        status: 404,
        statusMessage: "Handled but not found",
        body: "Not Found",
      },
    };
  }) as any,
}));

describe("Load Mappings", () => {
  test("should load mappings", async () => {
    const actual = await loadMappings("a-dir");

    expect(actual).toBeDefined();
    expect(actual.length).toBe(1);
    expect(actual[0].priority).toBe(1000);
    expect(actual[0].requestMatch).toBeDefined();
    expect(actual[0].requestMatch.url).toBe("/.*");
    expect(actual[0].requestMatch.urlType).toBe(UrlMatchType.PathPattern);
    expect(actual[0].requestMatch.method).toBe("ANY");
    expect(actual[0].responseDefinition).toBeDefined();
    expect(actual[0].responseDefinition.status).toBe(404);
    expect(actual[0].responseDefinition.statusMessage).toBe(
      "Handled but not found",
    );
    expect(actual[0].responseDefinition.body).toBe("Not Found");
    expect(listFilesInDir).toHaveBeenCalledTimes(1);
    expect(readJsonFile).toHaveBeenCalledTimes(1);
  });
});

describe("tranform scenarios", () => {
  test("should transform a scenario", () => {
    const actual = transformScenarioWithState(TEST_MAPPINGS);

    expect(actual).toBeDefined();
    expect(Array.from(actual.keys())).toEqual(["scenario-01"]);
    expect(actual.get("scenario-01")).toEqual(["Started", "Finished"]);
  });
});
