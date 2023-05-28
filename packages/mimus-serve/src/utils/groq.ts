import { evaluate, parse } from "groq-js";

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
