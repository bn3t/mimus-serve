import { Runtime } from "../core/runtime";
import {
  Configuration,
  HttpResponse,
  RequestModel,
  ResponseDefinition,
} from "../types";
import { DatasetResponseRenderer } from "./DatasetResponseRenderer";

describe("DatasetResponseRenderer", () => {
  it("should render the response", async () => {
    const renderer = new DatasetResponseRenderer();
    const responseDefinition: ResponseDefinition = {
      status: 200,
      statusMessage: "OK",
      headers: [{ name: "Content-Type", value: "text/plain" }],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      dataset: "test",
    };
    const response: HttpResponse = {
      status: 200,
      statusMessage: "OK",
      headers: [],
    };
    const datasets = new Map([["test", { a: 1 }]]);
    const result = await renderer.render(
      { general: { files: "./a-folder" } } as Configuration,
      [],
      new Runtime([], datasets),
      responseDefinition,
      [],
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
      statusMessage: "OK",
      headers: [],
      body: '{"a":1}',
    });
  });
});
