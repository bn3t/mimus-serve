import { equals } from "ramda";
import { Runtime } from "../core/runtime";
import {
  Configuration,
  Context,
  HttpResponse,
  ProcessingDefinition,
  ResponseDefinition,
  ResponseRenderer,
  OutputProcessingOperation,
  Mapping,
} from "../types";
import { evaluateGroq } from "../utils/groq";
import { evaluateJsonata } from "../utils/jsonata";

// process an aray of objects and replace one object with the matching one
export const replaceMatchingObjectInArray = (
  input: any[],
  objectToMatch: any,
  objectToReplace: any,
  operation: OutputProcessingOperation,
): any[] => {
  if (operation === "insertRequestBody") {
    return [[...input, objectToReplace], objectToReplace];
  }
  if (objectToMatch === undefined) {
    throw new Error("No match specified for operation " + operation);
  }
  const result = [];
  let currentData;
  for (const item of input) {
    if (equals(item, objectToMatch)) {
      if (operation === "mergeWithRequestBody") {
        currentData = { ...item, ...objectToReplace };
        result.push(currentData);
      } else if (operation === "replaceWithRequestBody") {
        currentData = objectToReplace;
        result.push(currentData);
      } else if (operation === "deleteMatching") {
        // do not insert anything
      } else {
        throw new Error(`Unknown operation ${operation}`);
      }
    } else {
      result.push(item);
    }
  }
  return [result, currentData];
};

/**
 * A response renderer to process the existing response with jsonata expressions.
 */
export class ProcessingResponseRenderer implements ResponseRenderer {
  /**
   * Render the response.
   * @param response The target http response
   * @param responseDefinition The response definition to render.
   * @param context The context to use for rendering.
   */
  async render(
    _configuration: Configuration,
    _mappings: Mapping[],
    runtime: Runtime,
    responseDefinition: ResponseDefinition,
    processing: ProcessingDefinition[],
    context: Context,
    response: HttpResponse,
  ): Promise<HttpResponse> {
    if (processing.length === 0) {
      return response;
    }

    const result: HttpResponse = {
      ...response,
    };

    const processingContext = new Map<string, any>();
    let datasetName;
    let processedData;
    processingContext.set(
      "requestBody",
      context.request.body !== undefined
        ? JSON.parse(context.request.body)
        : undefined,
    );
    const originalRequestBody = context.request.body;
    let body;
    for (const processingDefinition of processing) {
      switch (processingDefinition.type) {
        // Selects the dataset to use for the processing
        case "input":
          datasetName = processingDefinition.dataset;
          if (datasetName === undefined) {
            throw new Error("Dataset should be defined for input processing");
          }
          if (!runtime.hasDataset(datasetName)) {
            throw new Error(`Dataset ${datasetName} is not defined`);
          }
          processedData = runtime.getDataset(datasetName);
          break;
        // Creates a match from the processedData that can be used in the store processing step
        case "match":
          {
            const { expression, output, groqExpression } = processingDefinition;
            if (
              (expression === undefined && groqExpression === undefined) ||
              output === undefined
            ) {
              throw new Error(
                "An expression or a groqExpression and output should be defined for match processing",
              );
            }
            if (expression !== undefined) {
              const result = evaluateJsonata(
                expression,
                processedData,
                context,
              );
              processingContext.set(output, result);
            } else if (groqExpression !== undefined) {
              const result = await evaluateGroq(
                groqExpression,
                processedData,
                context,
              );
              processingContext.set(output, result);
            } else {
              throw new Error("No expression/groqExpression specified");
            }
          }
          break;
        // Transforms data in input to data in output using the expression
        case "transform":
          {
            const { expression, groqExpression, input, output } =
              processingDefinition;

            if (
              (expression === undefined && groqExpression === undefined) ||
              input === undefined ||
              output === undefined
            ) {
              throw new Error(
                "Expression or groqExpression, input and output should be defined for transform processing",
              );
            }
            const data = processingContext.get(input);
            if (expression !== undefined) {
              const transformed = evaluateJsonata(expression, data, context);
              processingContext.set(output, transformed);
            } else if (groqExpression !== undefined) {
              const transformed = await evaluateGroq(
                groqExpression,
                data,
                context,
              );
              console.log({ transformed });
              processingContext.set(output, transformed);
            } else {
              throw new Error("No expression/groqExpression specified");
            }
          }
          break;
        // Store a modification to the data in the dataset
        case "store":
          {
            const { operation, input, match, output } = processingDefinition;
            if (operation === undefined) {
              throw new Error(
                "Only replaceWithRequestBody, mergeWithRequestBody, insertRequestBody, deleteMatching is supported as output processing",
              );
            }
            if (match === undefined) {
              throw new Error("match should be defined for store processing");
            }
            const inputData = processingContext.get(input);
            const matchData = processingContext.get(match);
            const [newProcessedData, newCurrentData] =
              replaceMatchingObjectInArray(
                processedData,
                matchData,
                inputData,
                operation,
              );
            processedData = newProcessedData;
            if (output !== undefined) {
              processingContext.set(output, newCurrentData);
            }
          }
          break;
        case "response":
          {
            const { output } = processingDefinition;
            if (output === undefined) {
              throw new Error(
                "Output should be defined for response processing",
              );
            }
            if (output === "originalRequestBody") {
              body = originalRequestBody;
            } else {
              const outputValue = processingContext.get(output);

              if (typeof outputValue === "string") {
                body = outputValue;
              } else {
                body = JSON.stringify(outputValue);
              }
            }
          }
          break;
      }
    }

    if (datasetName !== undefined) {
      runtime.setDataset(datasetName, processedData);
    }

    if (body !== undefined) {
      result.body = body;
    }
    return result;
  }
}
