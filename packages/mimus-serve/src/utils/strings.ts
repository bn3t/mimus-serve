import { JSONPath } from "jsonpath-plus";
import { equals } from "ramda";

/**
 * Returns true if the given regular expression matches the entire value.
 * @param regexp Regular expression to match against
 * @param value String value to match against the regular expression
 * @returns true if the regular expression matches the entire value, false otherwise
 */
export const matchRegexp = (regexp: string, value: string) => {
  const re = new RegExp(regexp, "g");
  const match = value.match(re);
  return match !== null && (match[0]?.length ?? 0) === value.length;
};

/**
 * Returns true if the given JSON strings are equal.
 * @param value1 First JSON string to compare
 * @param value2 Second JSON string to compare
 * @returns true if the JSON strings are equal, false otherwise
 */
export const matchJson = (value1: string, value2: string) => {
  try {
    const json1 = JSON.parse(value1);
    const json2 = JSON.parse(value2);
    return equals(json1, json2);
  } catch (e) {
    return false;
  }
};

/**
 * Returns true if the given JSONPath expression matches the given JSON.
 * A JSON body will be considered to match a path expression if the expression
 * returns either a non-null single value (string, integer etc.), or a
 * non-empty object or array.
 * @param path JSONPath expression to match against
 * @param jsonAsString object to match against
 * @returns true if the path matches the json
 */
export const matchJsonPath = (path: string, jsonAsString: string) => {
  try {
    const json = JSON.parse(jsonAsString);
    const result = JSONPath({ path, json });
    return result != null && Array.isArray(result) && result.length > 0;
  } catch (error) {
    return false;
  }
};
