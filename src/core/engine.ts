import { FastifyReply } from "fastify";
import { IncomingMessage } from "node:http";

import { BodyPatternsMatcher } from "../matchers/body-patterns";
import { CookiesMatcher } from "../matchers/cookies";
import { HeadersMatcher } from "../matchers/headers";
import { MethodMatcher } from "../matchers/method";
import { QueryParametersMatcher } from "../matchers/query-params";
import { UrlMatcher } from "../matchers/url";
import { BaseResponseRenderer } from "../renderers/BaseResponseRenderer";
import { DatasetResponseRenderer } from "../renderers/DatasetResponseRenderer";
import { JsonataResponseRenderer } from "../renderers/JsonataResponseRenderer";
import { ProcessingResponseRenderer } from "../renderers/ProcessingResponseRenderer";
import { ProxyResponseRenderer } from "../renderers/ProxyResponseRenderer";
import {
  Configuration,
  Context,
  DEFAULT_HTTP_RESPONSE,
  HttpRequest,
  HttpResponse,
  Mapping,
  Method,
  RequestMatcher,
  ResponseRenderer,
} from "../types";
import { delay } from "../utils/promises";
import { buildRequestModel } from "../utils/request";
import { findMapping, transformResponseDefinition } from "./mapping";
import { Runtime } from "./runtime";

const DEFAULT_REQUEST_MATCHERS: RequestMatcher[] = [
  new UrlMatcher(),
  new MethodMatcher(),
  new QueryParametersMatcher(),
  new CookiesMatcher(),
  new HeadersMatcher(),
  new BodyPatternsMatcher(),
];

const DEFAULT_RESPONSE_RENDERERS: ResponseRenderer[] = [
  new BaseResponseRenderer(),
  new ProcessingResponseRenderer(),
  new DatasetResponseRenderer(),
  new ProxyResponseRenderer(),
  new JsonataResponseRenderer(),
];

export const processRequest = async (
  configuration: Configuration,
  mappings: Mapping[],
  runtime: Runtime,
  incomingMessage: IncomingMessage,
  incomingCookies: Record<string, string | undefined>,
  reply: FastifyReply,
  body: any,
  isHttps: boolean,
) => {
  const headers = Object.entries(incomingMessage.headers).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
  // map incoming cookies to NameValuePair[]
  const cookies = Object.entries(incomingCookies).map(([name, value]) => ({
    name,
    value,
  }));

  const mappedRequest: HttpRequest = {
    method: incomingMessage.method as Method,
    url: incomingMessage.url ?? "",
    headers,
    cookies,
    body: body,
  };
  const requestModel = buildRequestModel(
    incomingMessage,
    headers,
    body,
    incomingCookies,
    isHttps,
  );
  const mapping = findMapping(
    DEFAULT_REQUEST_MATCHERS,
    mappings,
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

    let response: HttpResponse = DEFAULT_HTTP_RESPONSE;
    //loop over all renderers and render the response
    try {
      for (const renderer of DEFAULT_RESPONSE_RENDERERS) {
        response = await renderer.render(
          configuration,
          mappings,
          runtime,
          responseDefinition,
          mapping.processing,
          context,
          response,
        );
      }

      await delay(
        Math.max(
          responseDefinition.fixedDelayMilliseconds,
          configuration.fixedDelayMilliseconds,
        ),
      );

      reply.code(response.status);

      // if (response.statusMessage !== undefined) {
      //   serverResponse.statusMessage = response.statusMessage;
      // }

      response.headers.forEach((h) => reply.header(h.name, h.value ?? ""));

      if (response.body !== undefined) {
        reply.send(response.body);
      }

      // Change scenario state if necessary
      if (
        mapping.scenarioName !== undefined &&
        mapping.newScenarioState !== undefined
      ) {
        runtime.changeScenarioState(
          mapping.scenarioName,
          mapping.newScenarioState,
        );
      }
    } catch (error: any) {
      reply.code(500);
      console.error("Error while processing request", error.message);
      reply.send("Error processing request: " + error.message);
    }
    // serverResponse.end();
  } else {
    reply.code(500);
    reply.send("No mapping found for this request");
    // serverResponse.end();
  }
};
