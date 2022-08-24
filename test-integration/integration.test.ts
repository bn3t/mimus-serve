import axios from "axios";

const BASE_URL = "http://localhost:4000";

const makeFullUrl = (url: string) => `${BASE_URL}${url}`;

describe("Integration Test", () => {
  test("should return 404 on not existing url", () => {
    expect(axios.get(makeFullUrl("/not-exist"))).rejects.toThrow(
      "Request failed with status code 404",
    );
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ])("should $name", async ({ name, url, expected }) => {
    const response = await axios.get(makeFullUrl(url));
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe(expected);
  });
});
