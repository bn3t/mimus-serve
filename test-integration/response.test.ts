import { myaxios } from "./test-utils";

describe("Response Definition specifics", () => {
  test("should return a response definition", async () => {
    const now = new Date();
    const actual = await myaxios.get("/delayed1000");

    expect(actual.status).toBe(200);
    expect(actual.data).toBe("Delayed response 1s");
    expect(new Date().getTime() / 1000).toBeCloseTo(
      (now.getTime() + 1000) / 1000,
      1,
    );
  });
});
