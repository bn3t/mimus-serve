import { Method, NameValuePair } from "./common";
import { HttpRequest } from "./http";

export enum UrlMatchType {
  Url, // Equality on the url (full)
  UrlPattern, // Regex on the url (full)
  Path, // Equality on the path only
  PathPattern, // Reqex on the path only
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
  | "absent";

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
}

export interface ResponseDefinition {
  status: number;
  statusMessage?: string;
  headers: NameValuePair[];
  body?: string;
  bodyFileName?: string;
}

export interface Mapping {
  priority: number;
  requestMatch: RequestMatch;
  responseDefinition: ResponseDefinition;
}

export interface Configuration {
  mappings: Mapping[];
}
