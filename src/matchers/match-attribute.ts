import { MatchAttributeSpec, MatchResult } from "../types";
import { matchRegexp } from "../utils/strings";

const verifyAttributeSpec = (
  matchAttributeSpec: MatchAttributeSpec,
  actualParams: Map<string, string>,
): boolean => {
  if (!actualParams.has(matchAttributeSpec.name)) {
    return matchAttributeSpec.operator === "absent";
  }
  const queryParameterValue = matchAttributeSpec.caseInsensitive
    ? matchAttributeSpec.value.toLowerCase()
    : matchAttributeSpec.value;
  let searchParamValue =
    actualParams.get(matchAttributeSpec.name) ?? "####invalid";
  searchParamValue = matchAttributeSpec.caseInsensitive
    ? searchParamValue.toLowerCase()
    : searchParamValue;
  switch (matchAttributeSpec.operator) {
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
      throw new Error("Unsupported operator " + matchAttributeSpec.operator);
  }
};

export const matchAttributeSpecs = (
  attributeSpecs: MatchAttributeSpec[],
  actualParams: Map<string, string>,
) => {
  if (attributeSpecs.length === 0) {
    return MatchResult.Discard;
  }

  const result = attributeSpecs.every((queryParameter: MatchAttributeSpec) =>
    verifyAttributeSpec(queryParameter, actualParams),
  );

  return result ? MatchResult.Match : MatchResult.NoMatch;
};
