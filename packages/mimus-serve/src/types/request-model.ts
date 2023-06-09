/**
 * Represents a HTTP request.
 */
export interface RequestModel {
  url: string;
  path: string;
  pathSegments: string[];
  query: Record<string, string | string[]> | undefined;
  method: string;
  host: string;
  port: number;
  scheme: string;
  baseUrl: string;
  headers: Record<string, string | string[]>;
  cookies: Record<string, string | undefined>;
  body?: string;
  route?: Record<string, string>;
}
