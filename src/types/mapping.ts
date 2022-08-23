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

export interface RequestMatch {
  urlType: UrlMatchType;
  url?: string;
  method: Method | "ANY";
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
  requestMatches: RequestMatch[];
  responseDefinition: ResponseDefinition;
}

export interface Configuration {
  mappings: Mapping[];
}
