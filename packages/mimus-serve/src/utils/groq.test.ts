import { evaluateGroq } from "./groq";

const TEST_DATA = [
  { id: 1, name: "John", age: 20 },
  { id: 2, name: "Mary", age: 28 },
  { id: 3, name: "Mike", age: 21 },
];

describe("Groq filtering", () => {
  test("should filter by Groq expression", async () => {
    const filteredData = await evaluateGroq("*[age>=25]", TEST_DATA);
    expect(filteredData).toBeDefined();
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].name).toBe("Mary");
  });

  test("should filter by Groq expression with bindings", async () => {
    const filteredData = await evaluateGroq("*[age>=$age]", TEST_DATA, {
      age: 25,
    });
    expect(filteredData).toBeDefined();
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].name).toBe("Mary");
  });

  test.skip("should filter by Groq expression with bindings - return uuid", async () => {
    const filteredData = await evaluateGroq(
      "*[age==$age]{modifiedId: $uuid()}",
      TEST_DATA,
      {
        id: 25,
      },
    );
    expect(filteredData).toBeDefined();
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].modifiedId).toBeDefined();
  });

  test("should filter by Groq expression with bindings", async () => {
    const filteredData = await evaluateGroq("*[age>=$age]", TEST_DATA, {
      age: 25,
    });
    expect(filteredData).toBeDefined();
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].name).toBe("Mary");
  });

  test("should filter by Groq expression with complex bindings", async () => {
    const filteredData = await evaluateGroq(
      "*[name==$request.query.name]{id, name}",
      TEST_DATA,
      {
        request: {
          query: { name: "Mary" },
        },
      },
    );
    expect(filteredData).toBeDefined();
    expect(filteredData.length).toBe(1);
    expect(filteredData[0].id).toBe(2);
    expect(filteredData[0].name).toBe("Mary");
  });
});
