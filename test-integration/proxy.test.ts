import { myaxios } from "./test-utils";

describe("Proxy Tests", () => {
  test("should proxy request to /api/planets/1/", async () => {
    const actual = await myaxios.get("/proxy/api/planets/1/");
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.name).toBe("Tatooine");
  });
});
