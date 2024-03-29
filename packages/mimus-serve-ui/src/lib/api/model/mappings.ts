import { Method, NameValuePair } from "./common";

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

export interface InputProcessing {
  type: "input";
  dataset: string;
  expression: string;
}
export interface MatchProcessing {
  type: "match";
  expression: string;
}

export interface TransformProcessing {
  type: "transform";
  input: string;
  expression: string;
}
export interface StoreProcessing {
  type: "store";
  operation:
    | "replaceWithRequestBody"
    | "mergeWithRequestBody"
    | "insertRequestBody"
    | "deleteMatching";
}

export interface ResponseProcessing {
  type: "response";
  output: "currentData" | "originalRequestBody";
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
  request: RequestMatch;
  response: ResponseDefinition;
  processing: ProcessingDefinition[];
}

export interface MappingsWithMeta {
  meta: { total: number };
  mappings: Mapping[];
}
