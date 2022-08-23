import url from "url";

import { HttpRequest, MatchResult, RequestMatch, UrlMatchType } from "../types";
import { RequestMatcher } from "../types";

export class UrlMatcher implements RequestMatcher {
  match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
    if (requestMatch.url === undefined) {
      return MatchResult.Discard;
    }
    switch (requestMatch.urlType) {
      case UrlMatchType.Url:
        return requestMatch.url === httpRequest.url
          ? MatchResult.Match
          : MatchResult.NoMatch;

      case UrlMatchType.UrlPattern:
        return (httpRequest.url?.match(requestMatch.url)?.length ?? -1) > 0
          ? MatchResult.Match
          : MatchResult.NoMatch;

      case UrlMatchType.Path:
        {
          const parsedUrl = url.parse(httpRequest.url);
          if (parsedUrl !== null) {
            return requestMatch.url === parsedUrl.pathname
              ? MatchResult.Match
              : MatchResult.NoMatch;
          }
        }
        break;
      case UrlMatchType.PathPattern:
        {
          const parsedUrl = url.parse(httpRequest.url);
          if (parsedUrl !== null) {
            return (parsedUrl.pathname?.match(requestMatch.url)?.length ?? -1) >
              0
              ? MatchResult.Match
              : MatchResult.NoMatch;
          }
        }
        break;
    }
    return MatchResult.Discard;
  }
}
