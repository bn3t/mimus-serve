import { Runtime } from "../core/runtime";
import { Method, NameValuePair } from "./common";
import { Configuration } from "./configuration";
import { Context } from "./context";
import { HttpRequest, HttpResponse } from "./http";

export enum UrlMatchType {
  Url = "Url", // Equality on the url (full)
  UrlPattern = "UrlPattern", // Regex on the url (full)
  Path = "Path", // Equality on the path only
  PathPattern = "PathPattern", // Reqex on the path only
}

export enum MatchResult {
  Match,
  NoMatch,
  Discard,
}

export interface RequestMatcher {
  match(requestMatch: RequestMatch, request: HttpRequest): MatchResult;
}

export interface ResponseRenderer {
  render(
    configuration: Configuration,
    mappings: Mapping[],
    runtime: Runtime,
    responseDefinition: ResponseDefinition,
    processing: ProcessingDefinition[],
    context: Context,
    response: HttpResponse,
  ): Promise<HttpResponse>;
}

export interface ResponseDefinitionTransforer {
  transform(
    responseDefinition: ResponseDefinition,
    context: Context,
  ): ResponseDefinition;
}

export type OperatorType =
  | "equalTo"
  | "matches"
  | "contains"
  | "doesNotMatch"
  | "absent"
  | "present"
  | "equalToJson"
  | "matchesJsonPath";

export interface MatchAttributeSpec {
  operator: OperatorType;
  caseInsensitive: boolean;
  name: string;
  value: string;
}

export interface RequestMatch {
  urlType: UrlMatchType;
  url?: string;
  method: Method | "ANY";
  queryParameters: MatchAttributeSpec[];
  cookies: MatchAttributeSpec[];
  headers: MatchAttributeSpec[];
  bodyPatterns: MatchAttributeSpec[];
}

export interface ResponseDefinition {
  status?: number;
  statusMessage?: string;
  headers: NameValuePair[];
  body?: string;
  bodyFileName?: string;
  fixedDelayMilliseconds: number;
  transform: boolean;
  jsonataExpression?: string;
  groqExpression?: string;
  dataset?: string;
  proxyBaseUrl?: string;
  proxyUrlPrefixToRemove?: string;
  proxyForwardHeaders?: boolean;
}

export interface InputProcessing {
  type: "input";
  dataset: string;
  expression?: string;
  groqExpression?: string;
}
export interface MatchProcessing {
  type: "match";
  expression?: string;
  groqExpression?: string;
  output: string;
}

export interface TransformProcessing {
  type: "transform";
  expression?: string;
  groqExpression?: string;
  input: string;
  output: string;
}
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

export interface ResponseProcessing {
  type: "response";
  output: string | "originalRequestBody";
}

export type OutputProcessingOperation = StoreProcessing["operation"];

export type ProcessingDefinition =
  | InputProcessing
  | MatchProcessing
  | TransformProcessing
  | StoreProcessing
  | ResponseProcessing;

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
