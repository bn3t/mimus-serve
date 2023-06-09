import { Method, NameValuePair } from "./common";

/**
 * Represents an HTTP request. This is the object that is passed to each render class in Mimus Serve.
 * It abstracts away the underlying HTTP library.
 */
export interface HttpRequest {
  method: Method;
  url: string;
  headers: NameValuePair[];
  cookies: NameValuePair[];
  body: string;
}

/**
 * Represents an HTTP response. This is the object that is returned from each render class in Mimus Serve.
 * It abstracts away the underlying HTTP library.
 */
export interface HttpResponse {
  status: number;
  statusMessage?: string;
  headers: NameValuePair[];
  body?: string | Buffer;
}

/**
 * The default HTTP response object that is returned from each render class in Mimus Serve.
 * It has a status code of 500 and empty headers.
 */
export const DEFAULT_HTTP_RESPONSE: HttpResponse = {
  status: 500,
  headers: [],
};
