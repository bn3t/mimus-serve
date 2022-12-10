import jsonata from "jsonata";
import { v4 as uuid } from "uuid";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const evaluateJsonata = (
  jsonataExpression: string,
  data: any,
  bindings?: Record<string, any>,
) => {
  const expression = jsonata(jsonataExpression);
  expression.registerFunction("uuid", uuid);
  expression.registerFunction("randomInt", randomInt);
  const filteredData = expression.evaluate(data, bindings);
  return filteredData;
};
