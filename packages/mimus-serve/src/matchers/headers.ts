import { HttpRequest, MatchResult, RequestMatch } from "../types";
import { RequestMatcher } from "../types";
import { matchAttributeSpecs } from "./match-attribute";

export class HeadersMatcher implements RequestMatcher {
  match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
    const headers = new Map(
      httpRequest.headers.map((header) => [
        header.name,
        header.value?.toString() ?? "###unsupported",
      ]),
    );
    return matchAttributeSpecs(requestMatch.headers, headers);
  }
}
