/* eslint-disable @typescript-eslint/ban-ts-comment */
import { buildRequestModel } from "./request";

describe("Request", () => {
  test("should throw if req.url is undefined", () => {
    const req = {
      url: undefined,
      method: "GET",
      headers: {
        host: "localhost",
        "content-type": "application/json",
      },
      body: "body",
    };
    expect(() => buildRequestModel(req, [], "", false)).toThrow();
  });

  test("should throw if req.method is undefined", () => {
    const req = {
      url: "http://localhost:3000/test/path?query=value",
      method: undefined,
      headers: {
        host: "localhost",
        "content-type": "application/json",
      },
      body: "body",
    };
    expect(() => buildRequestModel(req, [], "", false)).toThrow();
  });

  test("should build a RequestModel from a request", () => {
    const req = {
      url: "http://localhost:3000/test/path?query=value",
      method: "GET",
      headers: {
        host: "localhost",
        "content-type": "application/json",
      },
      body: "body",
    };
    const headers = [
      { name: "content-type", value: "application/json" },
      { name: "host", value: "localhost" },
    ];

    const requestModel = buildRequestModel(req, headers, "body", false);

    expect(requestModel).toBeDefined();
    expect(requestModel.url).toBe("/test/path?query=value");
    expect(requestModel.path).toBe("/test/path");
    expect(requestModel.pathSegments).toEqual(["test", "path"]);
    expect(requestModel.query).toEqual({ query: "value" });
    expect(requestModel.method).toBe("GET");
    expect(requestModel.host).toBe("localhost");
    expect(requestModel.port).toBe(3000);
    expect(requestModel.scheme).toBe("http");
    expect(requestModel.baseUrl).toBe("http://localhost:3000");
    expect(requestModel.headers).toEqual({
      "content-type": "application/json",
      host: "localhost",
    });
    expect(requestModel.cookies).toEqual({});
    expect(requestModel.body).toBe("body");
  });

  test("should build a RequestModel from a request - query is multi-value", () => {
    const req = {
      url: "http://localhost:3000/test/path?query=value1&query=value2",
      method: "GET",
      headers: {
        host: "localhost",
        "content-type": "application/json",
      },
      body: "body",
    };
    const headers = [
      { name: "content-type", value: "application/json" },
      { name: "host", value: "localhost" },
    ];

    const requestModel = buildRequestModel(req, headers, "body", false);

    expect(requestModel).toBeDefined();
    expect(requestModel.url).toBe("/test/path?query=value1&query=value2");
    expect(requestModel.path).toBe("/test/path");
    expect(requestModel.pathSegments).toEqual(["test", "path"]);
    expect(requestModel.query).toEqual({ query: ["value1", "value2"] });
    expect(requestModel.method).toBe("GET");
    expect(requestModel.host).toBe("localhost");
    expect(requestModel.port).toBe(3000);
    expect(requestModel.scheme).toBe("http");
    expect(requestModel.baseUrl).toBe("http://localhost:3000");
    expect(requestModel.headers).toEqual({
      "content-type": "application/json",
      host: "localhost",
    });
    expect(requestModel.cookies).toEqual({});
    expect(requestModel.body).toBe("body");
  });
});
