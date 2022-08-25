import { UrlMatchType, OperatorType, MatchResult } from "../types";
import { QueryParametersMatcher } from "./query-params";

describe("Query Parameters Matching", () => {
  test.each([
    {
      testname: "match should discard when no queryParameters specified",
      httpUrl: "https://example.org/?a=b&c=d",
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: undefined,
      value: "b",
      expected: MatchResult.Discard,
    },
    {
      testname: "match equal to query param case sensitive",
      httpUrl: "https://example.org/?a=b&c=d",
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "b",
      expected: MatchResult.Match,
    },
    {
      testname: "match equal to query param case insensitive",
      httpUrl: "https://example.org/?a=b&c=d",
      operator: "equalTo" as OperatorType,
      caseInsensitive: true,
      name: "a",
      value: "B",
      expected: MatchResult.Match,
    },
    {
      testname: "not match equal to query param different value",
      httpUrl: "https://example.org/?a=b&c=d",
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "blah",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "not match not existing parameter",
      httpUrl: "https://example.org/?a=b&c=d",
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: "blah",
      value: "b",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match contains parameter",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "contains" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "word",
      expected: MatchResult.Match,
    },
    {
      testname: "not match when no contains parameter",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "contains" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "blah",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match regular expression",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "matches" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*word$",
      expected: MatchResult.Match,
    },
    {
      testname: "not match regular expression",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "matches" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*blah$",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match inverse regular expression",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "doesNotMatch" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*blah$",
      expected: MatchResult.Match,
    },
    {
      testname: "not match inverse regular expression",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "doesNotMatch" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*word$",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match absent parameter",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "absent" as OperatorType,
      caseInsensitive: false,
      name: "blah",
      value: "",
      expected: MatchResult.Match,
    },
    {
      testname: "not match absent parameter but present",
      httpUrl: "https://example.org/?a=longword&c=d",
      operator: "absent" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "",
      expected: MatchResult.NoMatch,
    },
  ])(
    "should $testname",
    ({ httpUrl, operator, caseInsensitive, name, value, expected }) => {
      const matcher = new QueryParametersMatcher();

      const actual = matcher.match(
        {
          urlType: UrlMatchType.Path,
          method: "ANY",
          queryParameters:
            name !== undefined
              ? [{ name, caseInsensitive, operator, value }]
              : [],
        },
        {
          url: httpUrl,
          method: "GET",
          headers: [],
        },
      );
      expect(actual).toBe(expected);
    },
  );
});
