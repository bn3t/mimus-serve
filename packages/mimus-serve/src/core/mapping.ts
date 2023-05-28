import path from "path";
import { head, intersection } from "ramda";
import {
  v4 as uuid,
  parse as uuidParse,
  stringify as uuidStringify,
} from "uuid";
import { STARTED } from "../constants";
import {
  HttpRequest,
  Mapping,
  MatchResult,
  ProcessingDefinition,
  RequestMatcher,
  UrlMatchType,
} from "../types";
import {
  listFilesInDir,
  readJsonFile,
  readYamlFileMulti,
} from "../utils/files";
import { Runtime } from "./runtime";

/**
 * Finds the mapping that matches the given request and request matchers.
 *
 * @param requestMatchers - The request matchers to use to match the request.
 * @param mappings - The list of mappings to search for a match.
 * @param runtime - The runtime instance to use for scenario state.
 * @param mappedRequest - The mapped HTTP request to match against.
 * @returns The matching mapping, or undefined if no mapping was found.
 */
export const findMapping = (
  requestMatchers: RequestMatcher[],
  mappings: Mapping[],
  runtime: Runtime,
  mappedRequest: HttpRequest,
): Mapping | undefined => {
  const matchedMappings = mappings
    .filter((mapping) =>
      requestMatchers.every((requestMatcher) => {
        const matchResult = requestMatcher.match(
          mapping.requestMatch,
          mappedRequest,
        );
        return (
          matchResult === MatchResult.Match ||
          matchResult === MatchResult.Discard
        );
      }),
    )
    .filter((mapping) => {
      if (mapping.scenarioName === undefined) {
        return true;
      }
      return (
        mapping.requiredScenarioState ===
        runtime.getScenarioState(mapping.scenarioName)
      );
    });
  matchedMappings.sort((a, b) => b.priority - a.priority);
  if (matchedMappings.length > 0) {
    return matchedMappings[matchedMappings.length - 1];
  }
};

/**
 * Parses the URL from the given JSON request object and returns an object containing the URL type and URL value.
 *
 * @param jsonRequest - The JSON request object to parse the URL from.
 * @returns An object containing the URL type and URL value.
 */
export const parseUrl = (
  jsonRequest: any,
): { urlType: UrlMatchType; url: string } | undefined => {
  if (jsonRequest.url !== undefined) {
    return { urlType: UrlMatchType.Url, url: jsonRequest.url };
  } else if (jsonRequest.urlPattern !== undefined) {
    return { urlType: UrlMatchType.UrlPattern, url: jsonRequest.urlPattern };
  } else if (jsonRequest.urlPath !== undefined) {
    return { urlType: UrlMatchType.Path, url: jsonRequest.urlPath };
  } else if (jsonRequest.urlPathParams !== undefined) {
    return { urlType: UrlMatchType.PathParams, url: jsonRequest.urlPathParams };
  } else if (jsonRequest.urlPathPattern !== undefined) {
    return {
      urlType: UrlMatchType.PathPattern,
      url: jsonRequest.urlPathPattern,
    };
  }
};

/**
 * Maps an attribute specification object to an operator and value object.
 *
 * @param spec - The attribute specification object to map.
 * @returns An object containing the operator and value of the attribute specification.
 */
const mapOperator = (
  spec: Record<string, any>,
): { operator: string; value: string } => {
  const operator = head(
    intersection(Object.keys(spec), [
      "equalTo",
      "matches",
      "contains",
      "doesNotMatch",
      "absent",
      "present",
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

/**
 * Parses the attribute specifications of a mapping and returns an array of objects containing the name, operator, value, and case sensitivity of each attribute.
 *
 * @param specs - The attribute specifications to parse.
 * @param lowerCaseName - A boolean indicating whether the attribute names should be converted to lowercase.
 * @param forceName - An optional string to use as the attribute name instead of the key in the `specs` object.
 * @returns An array of objects containing the name, operator, value, and case sensitivity of each attribute.
 */
const parseAttributeSpecs = (
  specs: Record<string, any> | undefined,
  lowerCaseName: boolean,
  forceName: string | undefined = undefined,
): {
  name: string;
  operator: string;
  value: string;
  caseInsensitive: boolean;
}[] =>
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

/**
 * Parses the loaded mappings as raw json and returns an array of `Mapping` objects.
 *
 * @param loadedMappings - The loaded mappings to parse.
 * @returns An array of `Mapping` objects.
 */
const parseLoadedMappings = (loadedMappings: any): Mapping[] => {
  if (Array.isArray(loadedMappings)) {
    // Check if multi document
    return loadedMappings.map((mapping) => parseLoadedMappings(mapping)).flat();
  } else if (loadedMappings.mappings !== undefined) {
    // Multipile config
    return loadedMappings.mappings.map((jsonMapping: any) =>
      parseOne(jsonMapping),
    );
  } else {
    return [parseOne(loadedMappings)];
  }
};

/**
 * Parses the processing definitions of a mapping and returns an array of `ProcessingDefinition` objects.
 *
 * @param processing - The processing definitions to parse.
 * @returns An array of `ProcessingDefinition` objects.
 */
const parseProcessing = (
  processing: any,
): ProcessingDefinition[] | undefined => {
  if (processing === undefined) {
    return [];
  }
  return processing.map((processing: any) => {
    switch (processing.type) {
      case "input":
        return {
          type: "input",
          dataset: processing.dataset,
          expression: processing.expression,
          groqExpression: processing.groqExpression,
        };
      case "match":
        return {
          type: "match",
          expression: processing.expression,
          groqExpression: processing.groqExpression,
          output: processing.output,
        };
      case "transform":
        return {
          type: "transform",
          expression: processing.expression,
          groqExpression: processing.groqExpression,
          input: processing.input,
          output: processing.output,
        };
      case "store":
        return {
          type: "store",
          input: processing.input,
          match: processing.match,
          output: processing.output,
          operation: processing.operation,
        };
      case "response":
        return {
          type: "response",
          output: processing.output,
        };
    }
  });
};

/**
 * Parses a single mapping JSON object and returns a `Mapping` object.
 *
 * @param json - The JSON object to parse.
 * @returns A `Mapping` object.
 */
export const parseOne = (json: any): Mapping =>
  ({
    id: json.id ? uuidStringify(uuidParse(json.id)) : uuid(),
    name: json.name,
    scenarioName: json.scenarioName,
    requiredScenarioState: json.requiredScenarioState,
    newScenarioState: json.newScenarioState,
    priority: json.priority ?? 0,
    requestMatch: {
      ...parseUrl(json.request),
      method: json.request.method,
      queryParameters: parseAttributeSpecs(json.request.queryParameters, false),
      headers: parseAttributeSpecs(json.request.headers, true),
      cookies: parseAttributeSpecs(json.request.cookies, false),
      bodyPatterns: parseAttributeSpecs(
        json.request.bodyPatterns,
        false,
        "body",
      ),
    },
    processing: parseProcessing(json.processing),
    responseDefinition: {
      status: json.response.status,
      statusMessage: json.response.statusMessage,
      body: json.response.body,
      bodyFileName: json.response.bodyFileName,
      encoding: json.response.encoding,
      headers: json.response.headers
        ? Object.entries(json.response.headers).map(([name, value]) => ({
            name,
            value,
          }))
        : [],
      fixedDelayMilliseconds: json.response.fixedDelayMilliseconds ?? 0,
      transform:
        json.response.transformers !== undefined || json.response.transform,
      jsonataExpression: json.response.jsonataExpression,
      groqExpression: json.response.groqExpression,
      dataset: json.response.dataset,
      proxyBaseUrl: json.response.proxyBaseUrl,
      proxyUrlPrefixToRemove: json.response.proxyUrlPrefixToRemove,
      proxyForwardHeaders: json.response.proxyForwardHeaders,
    },
  } as Mapping);

/**
 * Loads all mappings from the given directory.
 *
 * @param mappingDir - The directory to load mappings from.
 * @returns A promise that resolves to an array of `Mapping` objects.
 * @throws An error if an unknown file extension is encountered.
 */
export const loadMappings = async (mappingDir: string): Promise<Mapping[]> => {
  const files = await listFilesInDir(mappingDir, [".json", ".yaml", ".yml"]);
  const mappings: Mapping[] = (
    await Promise.all(
      files.map(async (file) => {
        let loadedMappings;
        const ext = path.extname(file);
        if (ext === ".json") {
          loadedMappings = await readJsonFile(file);
        } else if (ext === ".yaml" || ext === ".yml") {
          loadedMappings = await readYamlFileMulti(file);
        } else {
          throw new Error(`Unknown file extension: ${file}`);
        }

        return parseLoadedMappings(loadedMappings);
      }),
    )
  ).flat();
  return mappings;
};

export const transformScenarioWithState = (
  mappings: Mapping[],
): Map<string, string[]> => {
  const scenarios = new Map<
    string,
    { scenarioName: string; states: Set<string | undefined> }
  >();
  mappings.forEach((mapping) => {
    if (mapping.scenarioName !== undefined) {
      if (scenarios.has(mapping.scenarioName)) {
        const scenario = scenarios.get(mapping.scenarioName);
        if (scenario !== undefined) {
          scenario.states.add(mapping.requiredScenarioState);
          scenario.states.add(mapping.newScenarioState);
        }
      } else {
        scenarios.set(mapping.scenarioName, {
          scenarioName: mapping.scenarioName,
          states: new Set([
            STARTED,
            mapping.requiredScenarioState,
            mapping.newScenarioState,
          ]),
        });
      }
    }
  });
  return new Map(
    Array.from(scenarios.values()).map((scenario) => [
      scenario.scenarioName,
      Array.from(scenario.states).filter((state) => state !== undefined),
    ]),
  ) as Map<string, string[]>;
};
