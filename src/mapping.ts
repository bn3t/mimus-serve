import {
  Configuration,
  HttpRequest,
  Mapping,
  MatchResult,
  RequestMatcher,
  UrlMatchType,
} from "./types";
import { listFilesInDir, readJsonFile } from "./utils/files";

export const findMapping = (
  requestMatchers: RequestMatcher[],
  mappings: Mapping[],
  mappedRequest: HttpRequest,
) => {
  const matchedMappings = mappings.filter((mapping) =>
    requestMatchers.every((requestMatcher) => {
      const matchResult = requestMatcher.match(
        mapping.requestMatch,
        mappedRequest,
      );
      return matchResult === MatchResult.Match;
    }),
  );
  matchedMappings.sort((a, b) => b.priority - a.priority);
  if (matchedMappings.length > 0) {
    return matchedMappings[matchedMappings.length - 1];
  }
};

export const parseUrl = (jsonRequest: any) => {
  if (jsonRequest.url !== undefined) {
    return { urlType: UrlMatchType.Url, url: jsonRequest.url };
  } else if (jsonRequest.urlPattern !== undefined) {
    return { urlType: UrlMatchType.UrlPattern, url: jsonRequest.urlPattern };
  } else if (jsonRequest.urlPath !== undefined) {
    return { urlType: UrlMatchType.Path, url: jsonRequest.urlPath };
  } else if (jsonRequest.urlPathPattern !== undefined) {
    return {
      urlType: UrlMatchType.PathPattern,
      url: jsonRequest.urlPathPattern,
    };
  }
};

export const parseOne = (json: any): Mapping =>
  ({
    priority: json.priority ?? 0,
    requestMatch: {
      ...parseUrl(json.request),
      method: json.request.method,
    },
    responseDefinition: {
      status: json.response.status,
      statusMessage: json.response.statusMessage,
      body: json.response.body,
      bodyFileName: json.response.bodyFileName,
      headers: json.response.headers
        ? Object.entries(json.response.headers).map(([name, value]) => ({
            name,
            value,
          }))
        : [],
    },
  } as Mapping);

export const loadMappings = async (mappingDir: string): Promise<Mapping[]> => {
  const files = await listFilesInDir(mappingDir, [".json"]);
  const mappings: Mapping[] = (
    await Promise.all(
      files.map(async (file) => {
        const json = await readJsonFile(file);

        if (json.mappings !== undefined) {
          // Multipile config
          return json.mappings.map((jsonMapping: any) => parseOne(jsonMapping));
        } else {
          return parseOne(json);
        }
      }),
    )
  ).flat();
  return mappings;
};

export const loadConfiguration = async (): Promise<Configuration> => {
  const mappings = await loadMappings("./test-data/mappings");
  return { mappings };
};
