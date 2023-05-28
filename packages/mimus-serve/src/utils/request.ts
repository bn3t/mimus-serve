import { IncomingMessage } from "http";
import Route from "route-parser";

import { NameValuePair } from "../types";
import { RequestModel } from "../types/request-model";

const buildQuery = (url: URL): Record<string, string | string[]> =>
  Array.from<[string, string]>(url.searchParams.entries()).reduce(
    (
      acc: Record<string, string | string[]>,
      [key, value]: [string, string],
    ) => {
      if (acc[key] === undefined) {
        acc[key] = value;
      } else {
        if (Array.isArray(acc[key])) {
          (acc[key] as string[]).push(value);
        } else {
          acc[key] = [acc[key] as string, value];
        }
      }
      return acc;
    },
    {},
  );

const buildHeaders = (
  headers: NameValuePair[],
): Record<string, string | string[]> =>
  headers.reduce(
    (acc: Record<string, string | string[]>, header: NameValuePair) => {
      acc[header.name] = header.value ?? "undefined";
      return acc;
    },
    {},
  );

export const buildRequestModel = (
  req: Pick<IncomingMessage, "url" | "method" | "headers">,
  headers: NameValuePair[],
  body: string,
  incomingCookies: Record<string, string | undefined>,
  isHttps: boolean,
  mappingUrl: string | undefined,
): RequestModel => {
  if (req.url === undefined || req.method === undefined) {
    throw new Error("Invalid request");
  }
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  let routeMatch = undefined;
  if (mappingUrl) {
    routeMatch = new Route(mappingUrl).match(req.url);
  }

  const requestModel: RequestModel = {
    url: parsedUrl.href.replace(parsedUrl.origin, ""),
    path: parsedUrl.pathname,
    pathSegments: parsedUrl.pathname.split("/").filter(Boolean) ?? [],
    query: buildQuery(parsedUrl),
    method: req.method,
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port, 10),
    scheme: isHttps ? "https" : "http",
    baseUrl: `${parsedUrl.protocol}//${parsedUrl.host}`,
    headers: buildHeaders(headers),
    cookies: incomingCookies,
    route:
      routeMatch !== undefined && routeMatch !== false ? routeMatch : undefined,
    body,
  };
  return requestModel;
};
