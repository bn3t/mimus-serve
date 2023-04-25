import { myaxios } from "./test-utils";

describe("Upload Tests", () => {
  test("should return 200 when PUT with application/pdf", async () => {
    const response = await myaxios.put("/upload", "test", {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("OK");
  });
});
