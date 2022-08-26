import { UrlMatchType, MatchAttributeSpec } from "../types";
import { QueryParametersMatcher } from "./query-params";

import { matchAttributeSpecs } from "./match-attribute";

jest.mock("./match-attribute");

describe("Query Parameters", () => {
  test("should $testname", () => {
    const matcher = new QueryParametersMatcher();

    const queryParameters = [
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
        queryParameters,
        headers: [],
      },
      {
        url: "https://example.org/?a=b&c=d",
        method: "DELETE",
        headers: [],
      },
    );
    expect(matchAttributeSpecs).toHaveBeenCalledTimes(1);
    expect(matchAttributeSpecs).toHaveBeenCalledWith(
      queryParameters,
      expect.anything(),
    );
  });
});
