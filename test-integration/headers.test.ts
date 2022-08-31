import { myaxios } from "./test-utils";

describe("Headers Test", () => {
  test.each([
    {
      testname: "get with headers equal to - match",
      headers: { "X-myheader": "WireMock" },
      url: "/headers",
      expected: "headers equalTo works",
    },
    {
      testname: "get with headers equal to - no match",
      headers: { "X-myheader": "OtherValue" },
      url: "/headers",
      expected: "Not Found",
    },
    {
      testname: "get with headers equal to and other headers",
      headers: { "X-myheader": "WireMock", "X-otherheader": "OtherValue" },
      url: "/headers",
      expected: "headers equalTo works",
    },
    {
      testname: "get with headers matches",
      headers: { "X-myheader": "DreamMock" },
      url: "/headers",
      expected: "headers matches works",
    },
    {
      testname: "get with headers matches case insensitive",
      headers: { "X-myheader": "anotherMock" },
      url: "/headers",
      expected: "headers matches case insensitive works",
    },
    {
      testname: "get with headers contains",
      headers: { "X-myheader": "longword" },
      url: "/headers",
      expected: "headers contains works",
    },
    {
      testname: "get with headers does not match",
      headers: { "X-myheader": "anything" },
      url: "/headers-for-does-not-match",
      expected: "headers does not match works",
    },
    {
      testname: "get with headers does not match",
      headers: { "X-myheader": "everythingistrue" },
      url: "/headers-for-does-not-match",
      expected: "Not Found",
    },
    {
      testname: "get with headers absent",
      headers: { "X-otherheader": "anything" },
      url: "/headers-for-absent",
      expected: "headers absent works",
    },
    {
      testname: "get with headers param",
      headers: { "X-myheader": "anything" },
      url: "/headers-for-absent",
      expected: "Not Found",
    },
    {
      testname: "get with headers present",
      headers: { "X-myheader": "anything" },
      url: "/headers-for-present",
      expected: "headers present works",
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
      const response = await myaxios.get(url, {
        headers,
      });
      expect(response).toBeDefined();
      expect(response.status).toBe(expected !== "Not Found" ? 200 : 404);
      expect(response.data).toBe(expected);
    },
  );
});
