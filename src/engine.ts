import { IncomingMessage, ServerResponse } from "node:http";
import { promisify } from "util";
import { findMapping } from "./mapping";
import { HeadersMatcher } from "./matchers/headers";
import { MethodMatcher } from "./matchers/method";
import { QueryParametersMatcher } from "./matchers/query-params";
import { UrlMatcher } from "./matchers/url";
import { HttpRequest, Mapping, Method, RequestMatcher } from "./types";
import { readFile } from "./utils/files";

const DEFAULT_REQUEST_MATCHERS: RequestMatcher[] = [
  new UrlMatcher(),
  new MethodMatcher(),
  new QueryParametersMatcher(),
  new HeadersMatcher(),
];

export const processRequest = async (
  mappings: Mapping[],
  incomingMessage: IncomingMessage,
  serverResponse: ServerResponse,
) => {
  const writeResponse = promisify<unknown, void>(
    serverResponse.write.bind(serverResponse),
  );
  const headers = Object.entries(incomingMessage.headers).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
  const mappedRequest: HttpRequest = {
    method: incomingMessage.method as Method,
    url: incomingMessage.url ?? "",
    headers,
  };
  const mapping = findMapping(
    DEFAULT_REQUEST_MATCHERS,
    mappings,
    mappedRequest,
  );
  if (mapping !== undefined) {
    const sendResponse = async () => {
      const responseDefinition = mapping.responseDefinition;
      if (responseDefinition.status !== undefined) {
        serverResponse.statusCode = responseDefinition.status;
      }

      if (responseDefinition.statusMessage !== undefined) {
        serverResponse.statusMessage = responseDefinition.statusMessage;
      }

      responseDefinition.headers.forEach((h) =>
        serverResponse.setHeader(h.name, h.value ?? ""),
      );

      if (responseDefinition.body !== undefined) {
        await writeResponse(mapping.responseDefinition.body);
      } else if (responseDefinition.bodyFileName !== undefined) {
        await writeResponse(await readFile(responseDefinition.bodyFileName));
      }
      serverResponse.end();
    };
    if (mapping.responseDefinition.fixedDelayMilliseconds > 0) {
      setTimeout(
        sendResponse,
        mapping.responseDefinition.fixedDelayMilliseconds,
      );
    } else {
      sendResponse();
    }
  } else {
    serverResponse.statusCode = 500;
    await writeResponse("No mapping found for this request");
    serverResponse.end();
  }
};
