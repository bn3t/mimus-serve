import { RequestModel } from "../types/request-model";
import { processTemplate } from "./templating";

const REQUEST_MODEL: RequestModel = {
  url: "http://localhost:8080/request-body/templated",
  path: "/request-body",
  pathSegments: ["request-body", "templated"],
  query: {
    search: "value",
    multiple: ["value1", "value2"],
  },
  method: "POST",
  host: "localhost",
  port: 8080,
  scheme: "http",
  baseUrl: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    "X-Request-Id": "12345",
  },
  cookies: {},
  body: '{"test":"value"}',
};

describe("Template", () => {
  test("should parse template", () => {
    const template = "{{a}}";
    const data = { a: "b" };
    const result = processTemplate(template, data);
    expect(result).toBe("b");
  });

  test.each([
    {
      testname: "parse template {{request.url}}",
      template: "{{request.url}}",
      data: { request: REQUEST_MODEL },
      expected: "http://localhost:8080/request-body/templated",
    },
    {
      testname: "parse template {{request.pathSegments.[1]}}",
      template: "{{request.pathSegments.[1]}}",
      data: { request: REQUEST_MODEL },
      expected: "templated",
    },
    {
      testname: "parse template {{request.query.search}}",
      template: "{{request.query.search}}",
      data: { request: REQUEST_MODEL },
      expected: "value",
    },
    {
      testname: "parse template {{request.query.multiple.[0]}}",
      template: "{{request.query.multiple.[0]}}",
      data: { request: REQUEST_MODEL },
      expected: "value1",
    },
    {
      testname: "parse template {{request.headers.X-Request-Id}}",
      template: "{{request.headers.X-Request-Id}}",
      data: { request: REQUEST_MODEL },
      expected: "12345",
    },
  ])("should $testname", ({ data, template, expected }) => {
    const result = processTemplate(template, data);
    expect(result).toBe(expected);
  });
});
