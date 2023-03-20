import { parse, evaluate } from "groq-js";

import { v4 as uuid } from "uuid";

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const evaluateGroq = async (
  groqExpression: string,
  data: any,
  bindings?: Record<string, any>,
) => {
  try {
    const tree = parse(groqExpression);
    const filteredData = await evaluate(tree, {
      dataset: data,
      params: bindings,
    });
    return filteredData.get();
  } catch (error: any) {
    throw new Error(
      `Error evaluating groq expression (${groqExpression}): ${error.message}`,
    );
  }
};
