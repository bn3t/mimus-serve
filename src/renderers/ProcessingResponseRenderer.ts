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

    let datasetName;
    let processedData;
    let match;
    let requestBody = context.request.body;
    const originalRequestBody = requestBody;
    let currentData;
    let body;
    for (const processingDefinition of processing) {
      switch (processingDefinition.type) {
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
        case "match":
          {
            const expression = processingDefinition.expression;
            if (expression === undefined) {
              throw new Error(
                "Expression should be defined for match processing",
              );
            }
            match = evaluateJsonata(expression, processedData, context);
          }
          break;
        case "transform":
          {
            const { expression, input } = processingDefinition;

            if (expression === undefined || input === undefined) {
              throw new Error(
                "Expression and input should be defined for transform processing",
              );
            } else if (input !== "requestBody") {
              throw new Error(
                "Only requestBody is supported as input for transform processing",
              );
            }
            if (context.request.body !== undefined) {
              const data = JSON.parse(context.request.body);
              const transformed = evaluateJsonata(expression, data, context);
              requestBody = JSON.stringify(transformed);
            }
          }
          break;
        case "store":
          {
            const { operation } = processingDefinition;
            if (operation === undefined) {
              throw new Error(
                "Only insertRequestBody is supported as output processing",
              );
            }
            try {
              if (requestBody !== undefined) {
                currentData = JSON.parse(requestBody);
              }
            } catch (error) {
              // ignore error, currentData will be undefined
            }
            const [newProcessedData, newCurrentData] =
              replaceMatchingObjectInArray(
                processedData,
                match,
                currentData,
                operation,
              );
            processedData = newProcessedData;
            currentData = newCurrentData;
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
            switch (output) {
              case "originalRequestBody":
                body = originalRequestBody;
                break;
              case "currentData":
                body = JSON.stringify(currentData);
                break;
              default:
                throw new Error(`Unknown output ${output}`);
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
