import { HttpRequest, MatchResult, RequestMatch } from "../types";
import { RequestMatcher } from "../types";
import { matchAttributeSpecs } from "./match-attribute";

export class BodyPatternsMatcher implements RequestMatcher {
  match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
    const body = new Map([["body", httpRequest.body]]);
    return matchAttributeSpecs(requestMatch.bodyPatterns, body);
  }
}
