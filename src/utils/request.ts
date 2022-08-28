import { IncomingMessage } from "http";
import { NameValuePair } from "../types";
import { RequestModel } from "../types/request-model";

export const buildRequestModel = (
  req: Pick<IncomingMessage, "url" | "method" | "headers">,
  headers: NameValuePair[],
  body: string,
  isHttps: boolean,
): RequestModel => {
  if (req.url === undefined || req.method === undefined) {
    throw new Error("Invalid request");
  }
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const requestModel: RequestModel = {
    url: parsedUrl.href,
    path: parsedUrl.pathname,
    pathSegments: parsedUrl.pathname.split("/").filter(Boolean) ?? [],
    query: Array.from<[string, string | string[]]>(
      parsedUrl.searchParams.entries(),
    ).reduce(
      (
        acc: Record<string, string | string[]>,
        [key, value]: [string, string | string[]],
      ) => {
        if (Array.isArray(value)) {
          acc[key] = value;
        } else {
          acc[key] = [value];
        }
        return acc;
      },
      {},
    ),
    method: req.method,
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port, 10),
    scheme: isHttps ? "https" : "http",
    baseUrl: `${parsedUrl.protocol}//${parsedUrl.host}`,
    headers: headers.reduce(
      (acc: Record<string, string | string[]>, header: NameValuePair) => {
        acc[header.name] = header.value ?? "undefined";
        return acc;
      },
      {},
    ),
    cookies: {},
    body,
  };
  return requestModel;
};
