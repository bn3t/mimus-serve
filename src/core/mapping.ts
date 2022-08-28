import {
  v4 as uuid,
  parse as uuidParse,
  stringify as uuidStringify,
} from "uuid";
import { intersection, head } from "ramda";
import {
  Configuration,
  HttpRequest,
  Mapping,
  MatchResult,
  NameValuePair,
  RequestMatcher,
  ResponseDefinition,
  UrlMatchType,
  Context,
} from "../types";
import { listFilesInDir, readJsonFile } from "../utils/files";
import { processTemplate } from "../utils/templating";

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
      return (
        matchResult === MatchResult.Match || matchResult === MatchResult.Discard
      );
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

const mapOperator = (spec: Record<string, any>) => {
  const operator = head(
    intersection(Object.keys(spec), [
      "equalTo",
      "matches",
      "contains",
      "doesNotMatch",
      "absent",
      "equalToJson",
      "matchesJsonPath",
    ]),
  );
  if (operator === undefined) {
    return { operator: "##invalid", value: "##invalid" };
  }
  const value = spec[operator] as string;
  return {
    operator,
    value,
  };
};

const parseAttributeSpecs = (
  specs: Record<string, any> | undefined,
  lowerCaseName = false,
  forceName: string | undefined = undefined,
) =>
  specs !== undefined
    ? Object.entries(specs as Record<string, any>).map(
        ([name, spec]: [string, Record<string, any>]) => {
          const usedName = forceName !== undefined ? forceName : name;
          return {
            name: lowerCaseName ? usedName.toLowerCase() : usedName,
            caseInsensitive: spec.caseInsensitive ?? false,
            ...mapOperator(spec),
          };
        },
      )
    : [];

export const parseOne = (json: any): Mapping =>
  ({
    id: json.id ? uuidStringify(uuidParse(json.id)) : uuid(),
    name: json.name,
    priority: json.priority ?? 0,
    requestMatch: {
      ...parseUrl(json.request),
      method: json.request.method,
      queryParameters: parseAttributeSpecs(json.request.queryParameters),
      headers: parseAttributeSpecs(json.request.headers, true),
      bodyPatterns: parseAttributeSpecs(
        json.request.bodyPatterns,
        false,
        "body",
      ),
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
      fixedDelayMilliseconds: json.response.fixedDelayMilliseconds ?? 0,
      transform: json.response.transformers !== undefined,
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

export const loadConfiguration = async (
  filesDir: string,
  mappingsDir: string,
): Promise<Configuration> => {
  const mappings = await loadMappings(mappingsDir);
  return { files: filesDir, mappings };
};

// process response definition heders through templating
export const transformHeaders = (
  headers: NameValuePair[],
  context: Context,
) => {
  return headers
    .map((header) => {
      const { name, value } = header;
      let newValue: string | string[] | undefined;

      if (Array.isArray(value)) {
        newValue = value.map((v) => processTemplate(v, context) as string);
      } else {
        newValue = processTemplate(value, context);
      }

      return { name, value: newValue };
    })
    .filter((header) => header.value !== undefined);
};

// trnasform a mapping repsonse definition with processTemplate
export const transformResponseDefinition = (
  responseDefinition: ResponseDefinition,
  context: Context,
): ResponseDefinition => {
  return {
    ...responseDefinition,
    statusMessage: processTemplate(responseDefinition.statusMessage, context),
    body: processTemplate(responseDefinition.body, context),
    headers: transformHeaders(responseDefinition.headers, context),
    bodyFileName: processTemplate(responseDefinition.bodyFileName, context),
  };
};
