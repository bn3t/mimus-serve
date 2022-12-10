import { MatchAttributeSpec, MatchResult } from "../types";
import { matchJson, matchJsonPath, matchRegexp } from "../utils/strings";

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
  let actualParamValue =
    actualParams.get(matchAttributeSpec.name) ?? "####invalid";
  actualParamValue = matchAttributeSpec.caseInsensitive
    ? actualParamValue.toLowerCase()
    : actualParamValue;
  switch (matchAttributeSpec.operator) {
    case "equalTo":
      return queryParameterValue === actualParamValue;
    case "matches":
      return matchRegexp(queryParameterValue, actualParamValue);
    case "doesNotMatch":
      return !matchRegexp(queryParameterValue, actualParamValue);
    case "contains":
      return actualParamValue.includes(queryParameterValue);
    case "absent":
      return false;
    case "present":
      return true;
    case "equalToJson":
      return matchJson(queryParameterValue, actualParamValue);
    case "matchesJsonPath":
      return matchJsonPath(queryParameterValue, actualParamValue);
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
