import { UrlMatchType, MatchAttributeSpec } from "../types";
import { HeadersMatcher } from "./headers";

import { matchAttributeSpecs } from "./match-attribute";

jest.mock("./match-attribute");

describe("Headers Matcher", () => {
  test("should $testname", () => {
    const matcher = new HeadersMatcher();

    const headers = [
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
        headers,
        bodyPatterns: [],
      },
      {
        url: "https://example.org/?a=b&c=d",
        method: "DELETE",
        headers: [
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
      headers,
      expect.anything(),
    );
  });
});
