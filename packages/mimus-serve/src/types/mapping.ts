import { Runtime } from "../core/runtime";
import { Method, NameValuePair } from "./common";
import { Configuration } from "./configuration";
import { Context } from "./context";
import { HttpRequest, HttpResponse } from "./http";

/**
 * The type of matching to be performed on the URL.
 */
export enum UrlMatchType {
  Url = "Url", // Equality on the url (full)
  UrlPattern = "UrlPattern", // Regex on the url (full)
  Path = "Path", // Equality on the path only
  PathPattern = "PathPattern", // Reqex on the path only
  PathParams = "PathParams", // Match a path on path parameters
}

/**
 * The result of a request matching operation.
 */
export enum MatchResult {
  Match,
  NoMatch,
  Discard,
}

/**
 * Interface for defining a request matcher.
 */
export interface RequestMatcher {
  /**
   * Matches a request against a request match.
   * @param requestMatch The request match to match against.
   * @param request The request to match.
   * @returns The result of the matching operation.
   */
  match(requestMatch: RequestMatch, request: HttpRequest): MatchResult;
}

/**
 * Interface for defining a response renderer.
 */
export interface ResponseRenderer {
  /**
   * Renders a response based on the given parameters.
   * @param configuration The server configuration.
   * @param mapping The mapping that was matched.
   * @param runtime The server runtime.
   * @param responseDefinition The response definition to render.
   * @param context The request context.
   * @param response The response object to render to.
   * @returns A promise that resolves to the rendered response.
   */
  render(
    configuration: Configuration,
    mapping: Mapping,
    runtime: Runtime,
    responseDefinition: ResponseDefinition,
    context: Context,
    response: HttpResponse,
  ): Promise<HttpResponse>;
}

/**
 * Interface for defining a response definition transformer.
 */
export interface ResponseDefinitionTransformer {
  /**
   * Transforms a response definition based on the given context.
   * @param responseDefinition The response definition to transform.
   * @param context The request context.
   * @returns The transformed response definition.
   */
  transform(
    responseDefinition: ResponseDefinition,
    context: Context,
  ): ResponseDefinition;
}

/**
 * The type of operator to be used for matching a request attribute.
 */
export type OperatorType =
  | "equalTo"
  | "matches"
  | "contains"
  | "doesNotMatch"
  | "absent"
  | "present"
  | "equalToJson"
  | "matchesJsonPath";

/**
 * Specification for a match attribute. This is used to match a request attribute against a request match.
 * For example, a match attribute could be a query parameter, and the request match could be a query parameter match.
 * The match attribute specification would then be matched against the query parameters of the request.
 */
export interface MatchAttributeSpec {
  operator: OperatorType;
  caseInsensitive: boolean;
  name: string;
  value: string;
}

/**
 * Interface for defining a request match. This is used to match a request against a mapping.
 */
export interface RequestMatch {
  urlType: UrlMatchType;
  url?: string;
  method: Method | "ANY";
  queryParameters: MatchAttributeSpec[];
  cookies: MatchAttributeSpec[];
  headers: MatchAttributeSpec[];
  bodyPatterns: MatchAttributeSpec[];
}

/**
 * Interface for defining a response definition.
 * This is used to define the response that should be returned when a request is matched by a mapping.
 * A response definition can be transformed by a response definition transformer.
 */
export interface ResponseDefinition {
  status?: number;
  statusMessage?: string;
  headers: NameValuePair[];
  body?: string;
  bodyFileName?: string;
  encoding?: BufferEncoding | "buffer";
  fixedDelayMilliseconds: number;
  transform: boolean;
  jsonataExpression?: string;
  groqExpression?: string;
  dataset?: string;
  proxyBaseUrl?: string;
  proxyUrlPrefixToRemove?: string;
  proxyForwardHeaders?: boolean;
}

/**
 * Interface for defining an input processing step.
 * This is used to transform the input data before matching or storing it.
 */
export interface InputProcessing {
  type: "input";
  dataset: string;
  expression?: string;
  groqExpression?: string;
}

/**
 * Interface for defining a match processing step.
 * This is used to match the input data against a specified pattern and transform the output.
 */
export interface MatchProcessing {
  type: "match";
  expression?: string;
  groqExpression?: string;
  output: string;
}

/**
 * Interface for defining a transform processing step.
 * This is used to transform the input data and produce an output.
 */
export interface TransformProcessing {
  type: "transform";
  expression?: string;
  groqExpression?: string;
  input: string;
  output: string;
}

/**
 * Interface for defining a store processing step.
 * This is used to store the input data in a specified location in a dataset.
 */
export interface StoreProcessing {
  type: "store";
  input: string;
  match: string;
  output?: string;
  operation:
    | "replaceWithRequestBody"
    | "mergeWithRequestBody"
    | "insertRequestBody"
    | "deleteMatching";
}

/**
 * Interface for defining a response processing step.
 * This is used to transform the response data before returning it to the client.
 */
export interface ResponseProcessing {
  type: "response";
  output: string | "originalRequestBody";
}

/**
 * Type alias for the `operation` property of a `StoreProcessing` object.
 * This is used to specify the type of operation to perform when storing input data.
 */
export type OutputProcessingOperation = StoreProcessing["operation"];

/**
 * Type alias for a processing definition.
 * This is used to define a processing step that should be performed on the input data.
 * A processing definition can be an input, match, transform, store or response processing step.
 * @see InputProcessing
 * @see MatchProcessing
 * @see TransformProcessing
 * @see StoreProcessing
 * @see ResponseProcessing
 */
export type ProcessingDefinition =
  | InputProcessing
  | MatchProcessing
  | TransformProcessing
  | StoreProcessing
  | ResponseProcessing;

/**
 * Interface for defining a mapping between a request and a response.
 */
export interface Mapping {
  id: string;
  name?: string;
  priority: number;
  scenarioName?: string;
  requiredScenarioState?: string;
  newScenarioState?: string;
  requestMatch: RequestMatch;
  responseDefinition: ResponseDefinition;
  processing: ProcessingDefinition[];
}
