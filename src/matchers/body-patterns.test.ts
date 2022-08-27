import { UrlMatchType, MatchAttributeSpec } from "../types";

import { matchAttributeSpecs } from "./match-attribute";
import { BodyPatternsMatcher } from "./body-patterns";

jest.mock("./match-attribute");

describe("Body Patterns", () => {
  test("should match body patterns", () => {
    const matcher = new BodyPatternsMatcher();

    const bodyPatterns = [
      {
        name: "body",
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
        bodyPatterns,
      },
      {
        url: "https://example.org/?a=b&c=d",
        method: "DELETE",
        headers: [],
        body: "testvalue",
      },
    );
    expect(matchAttributeSpecs).toHaveBeenCalledTimes(1);
    expect(matchAttributeSpecs).toHaveBeenCalledWith(
      bodyPatterns,
      expect.anything(),
    );
  });
});
