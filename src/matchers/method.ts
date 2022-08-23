import { HttpRequest, MatchResult, RequestMatch } from "../types";
import { RequestMatcher } from "../types";

export class MethodMatcher implements RequestMatcher {
  match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
    if (requestMatch.method === undefined) {
      return MatchResult.Discard;
    }

    return requestMatch.method === "ANY" ||
      requestMatch.method === httpRequest.method
      ? MatchResult.Match
      : MatchResult.NoMatch;
  }
}
