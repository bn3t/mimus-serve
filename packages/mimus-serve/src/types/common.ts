export type Method = "GET" | "POST" | "PUT" | "DELETE" | "ANY";

export type NameValuePair = {
  name: string;
  value: string | string[] | undefined;
};
