import { HttpRequest, MatchResult, RequestMatch } from "../types";
import { RequestMatcher } from "../types";
import { matchAttributeSpecs } from "./match-attribute";

export class QueryParametersMatcher implements RequestMatcher {
  match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
    const searchParams = new Map(
      new URL(httpRequest.url, "http://localhost").searchParams.entries(),
    );
    return matchAttributeSpecs(requestMatch.queryParameters, searchParams);
  }
}
