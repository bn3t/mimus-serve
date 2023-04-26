import fs from "fs/promises";

import { myaxios } from "./test-utils";

describe("Binary Get Tests", () => {
  test("should return 200 with the correct file", async () => {
    const response = await myaxios.get("/binary", {
      responseType: "arraybuffer",
    });
    const buffer = await fs.readFile("./test-data/files/sample-3pp.pdf");
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toEqual(buffer);
  });
});
