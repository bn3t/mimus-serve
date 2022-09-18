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
import { readFile } from "../utils/files";

/**
 * A base response renderer for basic rendering of responses.
 */
export class BaseResponseRenderer implements ResponseRenderer {
  /**
   * Render the response.
   * @param response The target http response
   * @param responseDefinition The response definition to render.
   * @param context The context to use for rendering.
   */
  async render(
    configuration: Configuration,
    _mappings: Mapping[],
    _runtime: Runtime,
    responseDefinition: ResponseDefinition,
    _processing: ProcessingDefinition[],
    _context: Context,
    response: HttpResponse,
  ): Promise<HttpResponse> {
    const result: HttpResponse = {
      ...response,
      statusMessage: responseDefinition.statusMessage,
      headers: responseDefinition.headers,
    };

    if (responseDefinition.status !== undefined) {
      result.status = responseDefinition.status;
    }

    if (responseDefinition.body !== undefined) {
      result.body = responseDefinition.body;
    } else if (responseDefinition.bodyFileName !== undefined) {
      result.body = await readFile(
        configuration.general.files,
        responseDefinition.bodyFileName,
      );
    }
    return result;
  }
}
