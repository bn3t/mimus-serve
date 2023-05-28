import { Runtime } from "../core/runtime";
import {
  Configuration,
  Context,
  HttpResponse,
  Mapping,
  ProcessingDefinition,
  ResponseDefinition,
  ResponseRenderer,
} from "../types";

/**
 * A response renderer to process the existing response with jsonata expressions.
 */
export class DatasetResponseRenderer implements ResponseRenderer {
  /**
   * Render the response.
   * @param response The target http response
   * @param responseDefinition The response definition to render.
   * @param context The context to use for rendering.
   */
  async render(
    _configuration: Configuration,
    _mapping: Mapping,
    runtime: Runtime,
    responseDefinition: ResponseDefinition,
    _context: Context,
    response: HttpResponse,
  ): Promise<HttpResponse> {
    if (responseDefinition.dataset === undefined) {
      return response;
    }

    const result: HttpResponse = {
      ...response,
    };

    result.body = JSON.stringify(
      runtime.getDataset(responseDefinition.dataset),
    );
    return result;
  }
}
