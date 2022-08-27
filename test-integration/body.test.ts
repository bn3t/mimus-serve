import { myaxios } from "./test-utils";

describe("Body Test", () => {
  test.each([
    {
      testname: "get with query param equal to",
      url: "/request-body",
      body: '["WireMock"]',
      expected: "Request body patterns equalTo works",
    },
    {
      testname: "get with query param equal to test=value",
      url: "/request-body",
      body: "test=value",
      expected: "Request body patterns equalTo works test=value",
    },
    {
      testname: "get with query param equal to json",
      url: "/request-body",
      body: '{"a":1}',
      expected: "Request body patterns equalToJson works",
    },
  ])("should $testname", async ({ url, expected, body }) => {
    const response = await myaxios.post(url, body);
    expect(response).toBeDefined();
    expect(response.status).toBe(expected !== "Not Found" ? 200 : 404);
    expect(response.data).toBe(expected);
  });
});
