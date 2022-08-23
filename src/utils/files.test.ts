import { readFile } from "./files";

const EXPECTED_FILE_DATA = `{
  "name": "A test name",
  "amount": 1234.5
}
`;

describe("file operations", () => {
  test("should read a test file as string", async () => {
    const actual = await readFile("./test-data/files/response.json");
    expect(actual).toEqual(EXPECTED_FILE_DATA);
  });
});
