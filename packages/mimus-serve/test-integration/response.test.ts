import { myaxios } from "./test-utils";

describe("Response Definition specifics", () => {
  test("should return a response definition", async () => {
    const now = new Date();
    const actual = await myaxios.get("/delayed1000");

    expect(actual.status).toBe(200);
    expect(actual.data).toBe("Delayed response 1s");
    const difference = (new Date().getTime() - now.getTime()) / 1000;
    expect(difference).toBeCloseTo(1.05, 1);
  });

  test.each([
    {
      testname: "transform templated response definitions",
      url: "/request-body/templated",
      expected: "transformed: templated",
    },
    {
      testname: "transform templated response definitions",
      url: "/request-body/not-templated",
      expected: "{{request.path.[0]}}",
    },
  ])("should $testname", async ({ url, expected }) => {
    const actual = await myaxios.get(url);
    expect(actual.status).toBe(200);
    expect(actual.data).toBe(expected);
  });

  test("should return 500 when trying to get a file that does not exist", async () => {
    const actual = await myaxios.get("/read-a-file-not-found");
    expect(actual.status).toBe(500);
  });
});
