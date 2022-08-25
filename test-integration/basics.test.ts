import axios from "axios";
import { makeFullUrl } from "./test-utils";

describe("Basic Get Tests", () => {
  test("should return 404 on not existing url", () => {
    expect(axios.get(makeFullUrl("/not-exist"))).rejects.toThrow(
      "Request failed with status code 404",
    );
  });

  test("should return 200 on / head", async () => {
    const response = await axios.head(makeFullUrl("/"));

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  test.each([
    {
      name: "get file content when read a file",
      url: "/read-a-file",
      expected: "Text content in a file",
    },
    {
      name: "get body from mapping",
      url: "/get-body",
      expected: "Text content in a body",
    },
    {
      name: "get from url with params",
      url: "/get-from-url?param=value",
      expected: "Get from url",
    },
    {
      name: "get from url pattern",
      url: "/get-from-url-pattern?param=value",
      expected: "Get from url pattern",
    },
    {
      name: "get from a path with pattern",
      url: "/get-from-url-path-pattern?param=value",
      expected: "Get from url path pattern",
    },
  ])("should $name", async ({ url, expected }) => {
    const response = await axios.get(makeFullUrl(url));

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe(expected);
  });
});
