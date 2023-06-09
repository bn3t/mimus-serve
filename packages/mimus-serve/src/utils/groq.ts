import { evaluate, parse } from "groq-js";

/**
 * Evaluates a GROQ expression against a given dataset and returns the filtered data.
 * @param groqExpression The GROQ expression to evaluate.
 * @param data The dataset to evaluate the expression against.
 * @param bindings Optional object containing variable bindings to use in the expression.
 * @returns The filtered data resulting from the evaluation of the GROQ expression.
 * @throws An error if there is a problem evaluating the GROQ expression.
 */
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
