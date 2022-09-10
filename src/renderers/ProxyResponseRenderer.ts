import axios from "axios";
import { Runtime } from "../core/runtime";
import {
  Configuration,
  Context,
  HttpResponse,
  ProcessingDefinition,
  ResponseDefinition,
  ResponseRenderer,
} from "../types";

/**
 * A base response renderer for basic rendering of responses.
 */
export class ProxyResponseRenderer implements ResponseRenderer {
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
    if (responseDefinition.proxyBaseUrl === undefined) {
      return response;
    }
    const result: HttpResponse = {
      ...response,
      statusMessage: responseDefinition.statusMessage,
      headers: responseDefinition.headers,
    };

    const url = responseDefinition.proxyUrlPrefixToRemove
      ? context.request.url.replace(
          responseDefinition.proxyUrlPrefixToRemove,
          "",
        )
      : context.request.url;

    const proxyResponse = await axios.request({
      method: context.request.method,
      url: responseDefinition.proxyBaseUrl + url,
      transformResponse: (data) => data,
    });

    result.status = proxyResponse.status;
    result.headers = Object.entries(proxyResponse.headers).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );
    result.body = proxyResponse.data;

    return result;
  }
}
