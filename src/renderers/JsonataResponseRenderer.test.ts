import {
  Configuration,
  HttpResponse,
  RequestModel,
  ResponseDefinition,
} from "../types";
import { evaluateJsonata } from "../utils/jsonata";
import { JsonataResponseRenderer } from "./JsonataResponseRenderer";

// mock evaluateJsonata with jest
jest.mock("../utils/jsonata", () => ({
  evaluateJsonata: jest
    .fn()
    .mockImplementation(
      (
        jsonataExpression: string,
        _data: any,
        _bindings?: Record<string, any>,
      ) => {
        return "jsonata processed " + jsonataExpression;
      },
    ),
}));

describe("JsonataResponseRenderer", () => {
  it("should render the response", async () => {
    const renderer = new JsonataResponseRenderer();
    const responseDefinition: ResponseDefinition = {
      status: 200,
      headers: [],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      jsonataExpression: "theexpression",
    };
    const response: HttpResponse = {
      status: 200,
      headers: [],
      body: "Hello World",
    };
    const result = await renderer.render(
      { files: "./a-folder" } as Configuration,
      responseDefinition,
      {
        request: {
          url: "http://localhost:8080/",
          host: "localhost",
          query: {},
          method: "GET",
          path: "/",
          pathSegments: [""],
          headers: {},
          body: "",
        } as RequestModel,
      },
      response,
    );
    expect(result).toEqual({
      status: 200,
      headers: [],
      body: '"jsonata processed theexpression"',
    });
    expect(evaluateJsonata).toHaveBeenCalledTimes(1);
  });
});
