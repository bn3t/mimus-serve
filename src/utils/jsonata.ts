import jsonata from "jsonata";

export const evaluateJsonata = (
  jsonataExpression: string,
  data: any,
  bindings?: Record<string, any>,
) => {
  const filteredData = jsonata(jsonataExpression).evaluate(data, bindings);
  return filteredData;
};
