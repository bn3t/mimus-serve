/**
 * Represents the HTTP method used in a request.
 * Can be one of "GET", "POST", "PUT", "DELETE", or "ANY".
 */
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "ANY";

/**
 * Represents a name-value pair, where the name is a string and the value can be a string, an array of strings, or undefined.
 */
export type NameValuePair = {
  name: string;
  value: string | string[] | undefined;
};
