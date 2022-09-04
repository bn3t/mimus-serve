import yaml from "js-yaml";
import { Runtime } from "../core/runtime";

import {
  Configuration,
  Context,
  HttpResponse,
  ProcessingDefinition,
  ResponseDefinition,
  ResponseRenderer,
} from "../types";
import { evaluateJsonata } from "../utils/jsonata";

/**
 * A response renderer to process the existing response with jsonata expressions.
 */
export class JsonataResponseRenderer implements ResponseRenderer {
  /**
   * Render the response.
   * @param response The target http response
   * @param responseDefinition The response definition to render.
   * @param context The context to use for rendering.
   */
  async render(
    _configuration: Configuration,
    _runtime: Runtime,
    responseDefinition: ResponseDefinition,
    _processing: ProcessingDefinition[],
    context: Context,
    response: HttpResponse,
  ): Promise<HttpResponse> {
    if (responseDefinition.jsonataExpression === undefined) {
      return response;
    }
    const result: HttpResponse = {
      ...response,
    };

    result.body = JSON.stringify(
      evaluateJsonata(
        responseDefinition.jsonataExpression,
        yaml.load(response.body ?? ""),
        context,
      ),
    );
    if (result.body === undefined) {
      result.status = 404;
      result.statusMessage = "Not Found (jsonata)";
    }
    return result;
  }
}
