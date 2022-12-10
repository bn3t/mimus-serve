import { readFile, readJsonFile, readYamlFileMulti } from "./files";

describe("file operations", () => {
  test("should read a test file as string", async () => {
    const actual = await readFile(
      process.cwd(),
      "./test-data/files/response.json",
    );
    expect(actual).toEqual("Text content in a file");
  });

  test("should throw if file is not in the directory", async () => {
    await expect(
      readFile(process.cwd(), "/test-data/files/response.json"),
    ).rejects.toThrow();
  });

  test("should read a json file as an object", async () => {
    const actual = await readJsonFile("./test-data/files/response-json.json");
    expect(actual).toStrictEqual({
      name: "A test name",
      amount: 1234.5,
    });
  });

  test("should read a yaml file as an object", async () => {
    const actual = await readYamlFileMulti(
      "./test-data/files/response-yaml.yaml",
    );
    expect(actual).toStrictEqual([
      {
        name: "A test name",
        amount: 1234.5,
      },
    ]);
  });
});
