import { Method, NameValuePair } from "./common";

export interface HttpRequest {
  method: Method;
  url: string;
  headers: NameValuePair[];
  cookies: NameValuePair[];
  body: string;
}

export interface HttpResponse {
  status: number;
  statusMessage?: string;
  headers: NameValuePair[];
  body?: string | Buffer;
}

export const DEFAULT_HTTP_RESPONSE: HttpResponse = {
  status: 500,
  headers: [],
};
