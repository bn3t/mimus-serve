import { HttpRequest, MatchResult, RequestMatch } from "../types";
import { RequestMatcher } from "../types";
import { matchAttributeSpecs } from "./match-attribute";

export class CookiesMatcher implements RequestMatcher {
  match(requestMatch: RequestMatch, httpRequest: HttpRequest): MatchResult {
    const cookies = new Map(
      httpRequest.cookies.map((cookies) => [
        cookies.name,
        cookies.value?.toString() ?? "###unsupported",
      ]),
    );
    return matchAttributeSpecs(requestMatch.cookies, cookies);
  }
}
