export interface RequestModel {
  url: string;
  path: string;
  pathSegments: string[];
  query: { [key: string]: string | string[] } | undefined;
  method: string;
  host: string;
  port: number;
  scheme: string;
  baseUrl: string;
  headers: { [key: string]: string | string[] };
  cookies: { [key: string]: string | undefined };
  body?: string;
}
