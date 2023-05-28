import { Context } from "../types";
import { transformResponseDefinition } from "./engine";
import { processTemplate } from "../utils/templating";

jest.mock("../utils/templating", () => ({
  processTemplate: jest
    .fn()
    .mockImplementation((template: string, _data: any) => {
      return template === "{{template}}" ? "transformed" : template;
    }),
}));

describe("Transform Response Definition", () => {
  test("should transform a response definition by calling processTemplate", () => {
    const responseDefinition = {
      body: "{{template}}",
      bodyFileName: "template.txt",
      headers: [
        { name: "Content-Type", value: "text/plain" },
        {
          name: "X-multiple-headers",
          value: ["{{template}}", "not-a-template"],
        },
      ],
      status: 200,
      statusMessage: "Everything was just fine!",
      fixedDelayMilliseconds: 123,
      transform: false,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = { template: "transformed" } as Context;

    const actual = transformResponseDefinition(
      responseDefinition,
      data as Context,
    );

    expect(actual).toBeDefined();
    expect(actual.body).toBe("transformed");
    expect(actual.bodyFileName).toBe("template.txt");
    expect(actual.headers).toStrictEqual([
      { name: "Content-Type", value: "text/plain" },
      {
        name: "X-multiple-headers",
        value: ["transformed", "not-a-template"],
      },
    ]);
    expect(actual.status).toBe(200);
    expect(actual.statusMessage).toBe("Everything was just fine!");
    expect(processTemplate).toHaveBeenCalledTimes(6);
  });
});
