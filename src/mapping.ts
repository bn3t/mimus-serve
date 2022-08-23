import {
  Configuration,
  HttpRequest,
  Mapping,
  MatchResult,
  RequestMatcher,
  UrlMatchType,
} from "./types";

const FAKE_MAPPINGS: Mapping[] = [
  {
    priority: 1000,
    requestMatches: [
      {
        urlType: UrlMatchType.PathPattern,
        url: "/.*",
        method: "ANY",
      },
    ],
    responseDefinition: {
      status: 404,
      statusMessage: "Handled but not found",
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "Not Found",
    },
  },
  {
    priority: 0,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/read-a-file",
        method: "ANY",
      },
    ],
    responseDefinition: {
      status: 200,
      statusMessage: "All ok",
      headers: [{ name: "Content-Type", value: "application/json" }],
      bodyFileName: "test-data/files/response.json",
    },
  },
  {
    priority: 0,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/url-to-get",
        method: "GET",
      },
    ],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "Obtained from /url-to-get",
    },
  },
  {
    priority: 0,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/ping",
        method: "ANY",
      },
    ],
    responseDefinition: {
      status: 200,
      statusMessage: "All ok",
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "Ping: Body is fine too",
    },
  },
  {
    priority: 10,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/url-to-match-method",
        method: "ANY",
      },
    ],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "URL to match method ANY",
    },
  },
  {
    priority: 0,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/url-to-match-method",
        method: "GET",
      },
    ],
    responseDefinition: {
      status: 200,
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "URL to match method GET",
    },
  },
];

export const loadConfiguration = async (): Promise<Configuration> => {
  return { mappings: FAKE_MAPPINGS };
};

export const findMapping = (
  requestMatchers: RequestMatcher[],
  mappings: Mapping[],
  mappedRequest: HttpRequest,
) => {
  const matchedMappings = mappings.filter((mapping) =>
    requestMatchers.every((requestMatcher) =>
      mapping.requestMatches.every((requestMatch) => {
        const matchResult = requestMatcher.match(requestMatch, mappedRequest);
        return matchResult === MatchResult.Match;
      }),
    ),
  );
  matchedMappings.sort((a, b) => b.priority - a.priority);
  if (matchedMappings.length > 0) {
    return matchedMappings[matchedMappings.length - 1];
  }
};
