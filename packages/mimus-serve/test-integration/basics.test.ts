import { myaxios } from "./test-utils";

describe("Basic Get Tests", () => {
  test("should return 404 on not existing url", async () => {
    const response = await myaxios.get("/ot-exist");
    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    expect(response.statusText).toBe("Not Found");
  });

  test("should return 200 on / head", async () => {
    const response = await myaxios.head("/");
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
    const response = await myaxios.get(url);

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe(expected);
  });
});
