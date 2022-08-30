import { IncomingMessage, ServerResponse } from "node:http";

import { promisify } from "util";
import { findMapping, transformResponseDefinition } from "./mapping";
import { BodyPatternsMatcher } from "../matchers/body-patterns";
import { HeadersMatcher } from "../matchers/headers";
import { MethodMatcher } from "../matchers/method";
import { QueryParametersMatcher } from "../matchers/query-params";
import { UrlMatcher } from "../matchers/url";
import {
  Configuration,
  Context,
  HttpRequest,
  Method,
  RequestMatcher,
} from "../types";
import { readFile } from "../utils/files";
import { buildRequestModel } from "../utils/request";
import { Runtime } from "./runtime";

const DEFAULT_REQUEST_MATCHERS: RequestMatcher[] = [
  new UrlMatcher(),
  new MethodMatcher(),
  new QueryParametersMatcher(),
  new HeadersMatcher(),
  new BodyPatternsMatcher(),
];

export const processRequest = async (
  configuration: Configuration,
  runtime: Runtime,
  incomingMessage: IncomingMessage,
  serverResponse: ServerResponse,
  body: any,
  isHttps: boolean,
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
    body: body,
  };
  const requestModel = buildRequestModel(
    incomingMessage,
    headers,
    body,
    isHttps,
  );
  const mapping = findMapping(
    DEFAULT_REQUEST_MATCHERS,
    configuration.mappings,
    runtime,
    mappedRequest,
  );

  if (mapping !== undefined) {
    const context: Context = {
      request: requestModel,
    };
    const responseDefinition =
      mapping.responseDefinition.transform || configuration.transform
        ? transformResponseDefinition(mapping.responseDefinition, context)
        : mapping.responseDefinition;
    const sendResponse = async () => {
      try {
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
          await writeResponse(responseDefinition.body);
        } else if (responseDefinition.bodyFileName !== undefined) {
          await writeResponse(
            await readFile(
              configuration.files,
              responseDefinition.bodyFileName,
            ),
          );
        }
        if (
          mapping.scenarioName !== undefined &&
          mapping.newScenarioState !== undefined
        ) {
          runtime.changeScenarioState(
            mapping.scenarioName,
            mapping.newScenarioState,
          );
        }
      } catch (error) {
        serverResponse.statusCode = 500;
        await writeResponse("Error processing request: " + error);
      }
      serverResponse.end();
    };
    if (responseDefinition.fixedDelayMilliseconds > 0) {
      setTimeout(sendResponse, responseDefinition.fixedDelayMilliseconds);
    } else {
      sendResponse();
    }
  } else {
    serverResponse.statusCode = 500;
    await writeResponse("No mapping found for this request");
    serverResponse.end();
  }
};
