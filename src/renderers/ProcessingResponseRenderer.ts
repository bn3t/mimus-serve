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
    return [...input, objectToReplace];
  }

  const result = [];
  for (const item of input) {
    if (equals(item, objectToMatch)) {
      if (operation === "mergeWithRequestBody") {
        result.push({ ...item, ...objectToReplace });
      } else if (operation === "replaceWithRequestBody") {
        result.push(objectToReplace);
      } else if (operation === "deleteMatching") {
        // do not insert anything
      } else {
        throw new Error(`Unknown operation ${operation}`);
      }
    } else {
      result.push(item);
    }
  }
  return result;
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
        case "output":
          {
            const operation = processingDefinition.operation;
            if (operation === undefined) {
              throw new Error(
                "Operation should be defined for output processing",
              );
            }
            let objectToReplace;
            try {
              if (context.request.body !== undefined) {
                objectToReplace = JSON.parse(context.request.body);
              }
            } catch (error) {
              // ignore error, objectToReplace will be undefined
            }
            processedData = replaceMatchingObjectInArray(
              processedData,
              match,
              objectToReplace,
              operation,
            );
          }
          break;
      }
    }

    if (datasetName !== undefined) {
      runtime.setDataset(datasetName, processedData);
    }

    if (responseDefinition.jsonataExpression !== undefined) {
      result.body = JSON.stringify(processedData);
    }
    return result;
  }
}
