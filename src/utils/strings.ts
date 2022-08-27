import { equals } from "ramda";

export const matchRegexp = (regexp: string, value: string) =>
  (value.match(regexp)?.length ?? 0) > 0;

export const matchJson = (value1: string, value2: string) => {
  try {
    const json1 = JSON.parse(value1);
    const json2 = JSON.parse(value2);
    return equals(json1, json2);
  } catch (e) {
    return false;
  }
};
