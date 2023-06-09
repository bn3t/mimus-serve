import jsonata from "jsonata";
import { v4 as uuid } from "uuid";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Evaluates a JSONata expression with the given data and optional bindings.
 * @param jsonataExpression The JSONata expression to evaluate.
 * @param data The data to evaluate the expression against.
 * @param bindings Optional bindings to use in the expression.
 * @returns The result of the evaluation.
 */
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
