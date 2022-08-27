import { OperatorType, MatchResult } from "../types";
import { matchAttributeSpecs } from "./match-attribute";

describe("Match Attribute Specs", () => {
  test.each([
    {
      testname: "match should discard when no queryParameters specified",
      actualParams: [
        ["a", "b"],
        ["c", "d"],
      ] as [string, string][],
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: undefined,
      value: "b",
      expected: MatchResult.Discard,
    },
    {
      testname: "match equal to query param case sensitive",
      actualParams: [
        ["a", "b"],
        ["c", "d"],
      ] as [string, string][],
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "b",
      expected: MatchResult.Match,
    },
    {
      testname: "match equal to query param case insensitive",
      actualParams: [
        ["a", "b"],
        ["c", "d"],
      ] as [string, string][],
      operator: "equalTo" as OperatorType,
      caseInsensitive: true,
      name: "a",
      value: "B",
      expected: MatchResult.Match,
    },
    {
      testname: "not match equal to query param different value",
      actualParams: [
        ["a", "b"],
        ["c", "d"],
      ] as [string, string][],
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "blah",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "not match not existing parameter",
      actualParams: [
        ["a", "b"],
        ["c", "d"],
      ] as [string, string][],
      operator: "equalTo" as OperatorType,
      caseInsensitive: false,
      name: "blah",
      value: "b",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match contains parameter",
      actualParams: [
        ["a", "longword"],
        ["c", "d"],
      ] as [string, string][],
      operator: "contains" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "word",
      expected: MatchResult.Match,
    },
    {
      testname: "not match when no contains parameter",
      actualParams: [
        ["a", "longword"],
        ["c", "d"],
      ] as [string, string][],
      operator: "contains" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "blah",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match regular expression",
      actualParams: [
        ["a", "longword"],
        ["c", "d"],
      ] as [string, string][],

      operator: "matches" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*word$",
      expected: MatchResult.Match,
    },
    {
      testname: "not match regular expression",
      actualParams: [
        ["a", "longword"],
        ["c", "d"],
      ] as [string, string][],
      operator: "matches" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*blah$",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match inverse regular expression",
      actualParams: [
        ["a", "longword"],
        ["c", "d"],
      ] as [string, string][],
      operator: "doesNotMatch" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*blah$",
      expected: MatchResult.Match,
    },
    {
      testname: "not match inverse regular expression",
      actualParams: [
        ["a", "longword"],
        ["c", "d"],
      ] as [string, string][],
      operator: "doesNotMatch" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "^.*word$",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match absent parameter",
      actualParams: [
        ["a", "b"],
        ["c", "d"],
      ] as [string, string][],
      operator: "absent" as OperatorType,
      caseInsensitive: false,
      name: "blah",
      value: "",
      expected: MatchResult.Match,
    },
    {
      testname: "not match absent parameter but present",
      actualParams: [
        ["a", "b"],
        ["c", "d"],
      ] as [string, string][],
      operator: "absent" as OperatorType,
      caseInsensitive: false,
      name: "a",
      value: "",
      expected: MatchResult.NoMatch,
    },
    {
      testname: "match equal to json",
      actualParams: [["body", '{"a":1}']] as [string, string][],
      operator: "equalToJson" as OperatorType,
      caseInsensitive: false,
      name: "body",
      value: '{"a":   1}',
      expected: MatchResult.Match,
    },
    {
      testname: "not match equal to json",
      actualParams: [["body", '{"a":1}']] as [string, string][],
      operator: "equalToJson" as OperatorType,
      caseInsensitive: false,
      name: "body",
      value: '{"a":2}',
      expected: MatchResult.NoMatch,
    },
  ])(
    "should $testname",
    ({ operator, caseInsensitive, name, value, expected, actualParams }) => {
      const actual = matchAttributeSpecs(
        name !== undefined ? [{ name, caseInsensitive, operator, value }] : [],
        new Map(actualParams),
      );
      expect(actual).toBe(expected);
    },
  );
});
