import { evaluateJsonata } from "./jsonata";

const TEST_DATA = [
  { id: 1, name: "John", age: 20 },
  { id: 2, name: "Mary", age: 28 },
  { id: 3, name: "Mike", age: 21 },
];

describe("JSONata filtering", () => {
  test("should filter by JSONata expression", () => {
    const filteredData = evaluateJsonata("[$[age > 25]]", TEST_DATA);
    expect(filteredData).toBeDefined();
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].name).toBe("Mary");
  });

  test("should filter by JSONata expression with bindings", () => {
    const filteredData = evaluateJsonata("[$[age > $age]]", TEST_DATA, {
      age: 25,
    });
    expect(filteredData).toBeDefined();
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].name).toBe("Mary");
  });
});
