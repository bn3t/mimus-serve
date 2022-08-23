import { Method, NameValuePair } from "./common";

export interface HttpRequest {
  method: Method;
  url: string;
  headers: NameValuePair[];
}

export interface HttpResponse {
  status: number;
  statusMessage?: string;
  headers: NameValuePair[];
}
