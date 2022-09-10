import { myaxios } from "./test-utils";

describe("Query Params Test", () => {
  test.each([
    {
      testname: "get with query param equal to",
      url: "/query-params?search_term=WireMock",
      expected: "equalTo works",
    },
    {
      testname: "get with query param equal to and other parameters",
      url: "/query-params?search_term=WireMock&otherparam=value",
      expected: "equalTo works",
    },
    {
      testname: "get with query param matches",
      url: "/query-params?search_term=MimusServe",
      expected: "matches works",
    },
    {
      testname: "get with query param matches case insensitive",
      url: "/query-params?search_term=anotherMock",
      expected: "matches case insensitive works",
    },
    {
      testname: "get with query param contains",
      url: "/query-params?search_term=longwordterm",
      expected: "contains works",
    },
    {
      testname: "get with query param does not match",
      url: "/query-params-for-does-not-match?search_term=anything",
      expected: "Does not match works",
    },
    {
      testname: "get with query param does not match",
      url: "/query-params-for-does-not-match?search_term=everythingistrue",
      expected: "Not Found",
    },
    {
      testname: "get with query param absent",
      url: "/query-params-for-absent?other=anything",
      expected: "absent works",
    },
    {
      testname: "get with query param param",
      url: "/query-params-for-absent?search_term=anything",
      expected: "Not Found",
    },
  ])("should $testname", async ({ url, expected }) => {
    const response = await myaxios.get(url);
    expect(response).toBeDefined();
    expect(response.status).toBe(expected !== "Not Found" ? 200 : 404);
    expect(response.data).toBe(expected);
  });
});
