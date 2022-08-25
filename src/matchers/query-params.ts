import {
  HttpRequest,
  MatchResult,
  QueryParameterSpec,
  RequestMatch,
} from "../types";
import { RequestMatcher } from "../types";
import { matchRegexp } from "../utils/strings";

export class QueryParametersMatcher implements RequestMatcher {
  match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
    if (requestMatch.queryParameters.length === 0) {
      return MatchResult.Discard;
    }

    const searchParams = new URL(httpRequest.url, "http://localhost")
      .searchParams;
    const result = requestMatch.queryParameters.every(
      (queryParameter: QueryParameterSpec) =>
        this.verify(queryParameter, searchParams),
    );

    return result ? MatchResult.Match : MatchResult.NoMatch;
  }

  verify(
    queryParameter: QueryParameterSpec,
    searchParams: URLSearchParams,
  ): boolean {
    if (!searchParams.has(queryParameter.name)) {
      return queryParameter.operator === "absent";
    }
    const queryParameterValue = queryParameter.caseInsensitive
      ? queryParameter.value.toLowerCase()
      : queryParameter.value;
    let searchParamValue =
      searchParams.get(queryParameter.name) ?? "####invalid";
    searchParamValue = queryParameter.caseInsensitive
      ? searchParamValue.toLowerCase()
      : searchParamValue;
    switch (queryParameter.operator) {
      case "equalTo":
        return queryParameterValue === searchParamValue;
      case "matches":
        return matchRegexp(queryParameterValue, searchParamValue);
      case "doesNotMatch":
        return !matchRegexp(queryParameterValue, searchParamValue);
      case "contains":
        return searchParamValue.includes(queryParameterValue);
      case "absent":
        return false;
      default:
        throw new Error("Unsupported operator " + queryParameter.operator);
    }
  }
}
