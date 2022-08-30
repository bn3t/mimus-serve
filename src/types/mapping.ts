import { Method, NameValuePair } from "./common";
import { HttpRequest } from "./http";

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

export type OperatorType =
  | "equalTo"
  | "matches"
  | "contains"
  | "doesNotMatch"
  | "absent"
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
  headers: MatchAttributeSpec[];
  bodyPatterns: MatchAttributeSpec[];
}

export interface ResponseDefinition {
  status: number;
  statusMessage?: string;
  headers: NameValuePair[];
  body?: string;
  bodyFileName?: string;
  fixedDelayMilliseconds: number;
  transform: boolean;
}

export interface Mapping {
  id: string;
  name?: string;
  priority: number;
  scenarioName?: string;
  requiredScenarioState?: string;
  newScenarioState?: string;
  requestMatch: RequestMatch;
  responseDefinition: ResponseDefinition;
}

export interface Configuration {
  transform: boolean;
  files: string;
  mappings: Mapping[];
}
