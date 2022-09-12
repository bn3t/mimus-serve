import { myaxios } from "./test-utils";

describe("Cookies Test", () => {
  test.each([
    {
      testname: "get with cookie equal to - match",
      headers: { Cookie: "search_term=WireMock" },
      url: "/cookies",
      expected: "request had a cookie search_term with value WireMock",
    },
    {
      testname: "get with cookie with template",
      headers: { Cookie: "search_term=WireMock" },
      url: "/cookies-with-template",
      expected: "cookie in template respoonse: WireMock",
    },
    {
      testname: "get without cookie equal to - match",
      headers: {},
      url: "/cookies",
      expected: "Request did not have a cookie",
    },
  ])(
    "should $testname",
    async ({
      url,
      expected,
      headers,
    }: {
      url: string;
      expected: string;
      headers: any;
    }) => {
      const response = await myaxios.get(url, { headers });
      expect(response).toBeDefined();
      expect(response.status).toBe(expected !== "Not Found" ? 200 : 404);
      expect(response.data).toBe(expected);
    },
  );
});
