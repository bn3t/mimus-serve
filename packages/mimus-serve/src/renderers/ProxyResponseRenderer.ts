import axios from "axios";
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
    _mapping: Mapping,
    _runtime: Runtime,
    responseDefinition: ResponseDefinition,
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
      headers:
        responseDefinition.proxyForwardHeaders !== undefined
          ? Object.fromEntries(
              Object.entries(context.request.headers).filter(
                ([key]) =>
                  !(
                    ["host", "referer", "origin"].includes(key) ||
                    key.startsWith("sec-")
                  ),
              ),
            )
          : undefined,
      transformResponse: (data) => data,
    });

    result.status = proxyResponse.status;
    result.headers = Object.entries(proxyResponse.headers)
      .filter(
        ([name]) =>
          name !== "transfer-encoding" && !name.startsWith("access-control-"),
      )
      .map(([name, value]) => ({
        name,
        value,
      }));
    result.body = proxyResponse.data;

    return result;
  }
}
