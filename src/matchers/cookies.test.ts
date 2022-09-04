import { UrlMatchType, MatchAttributeSpec } from "../types";
import { CookiesMatcher } from "./cookies";

import { matchAttributeSpecs } from "./match-attribute";

jest.mock("./match-attribute");

describe("Cookes Matcher", () => {
  test("should match cookie attribute", () => {
    const matcher = new CookiesMatcher();

    const cookies = [
      {
        name: "test",
        operator: "equalTo",
        value: "testvalue",
        caseInsensitive: false,
      },
    ] as MatchAttributeSpec[];
    matcher.match(
      {
        method: "GET",
        url: "blah",
        urlType: UrlMatchType.Path,
        queryParameters: [],
        headers: [],
        cookies,
        bodyPatterns: [],
      },
      {
        url: "https://example.org/?a=b&c=d",
        method: "DELETE",
        headers: [],
        cookies: [
          {
            name: "test",
            value: "testvalue",
          },
        ],
        body: "",
      },
    );
    expect(matchAttributeSpecs).toHaveBeenCalledTimes(1);
    expect(matchAttributeSpecs).toHaveBeenCalledWith(
      cookies,
      expect.anything(),
    );
  });
});
