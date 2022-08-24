import { readFile, readJsonFile } from "./files";

describe("file operations", () => {
  test("should read a test file as string", async () => {
    const actual = await readFile("./test-data/files/response.json");
    expect(actual).toEqual("Text content in a file");
  });

  test("should read a json file as string", async () => {
    const actual = await readJsonFile("./test-data/files/response-json.json");
    expect(actual).toStrictEqual({
      name: "A test name",
      amount: 1234.5,
    });
  });
});
