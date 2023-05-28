import { Runtime } from "../core/runtime";
import {
  Configuration,
  HttpResponse,
  Mapping,
  RequestModel,
  ResponseDefinition,
  UrlMatchType,
} from "../types";
import { BaseResponseRenderer } from "./BaseResponseRenderer";

const MAPPING: Mapping = {
  id: "test",
  name: "test",
  priority: 0,
  scenarioName: "test",
  requiredScenarioState: "test",
  newScenarioState: "test",
  requestMatch: {
    method: "ANY",
    urlType: UrlMatchType.Path,
    url: "/",
    queryParameters: [],
    headers: [],
    cookies: [],
    bodyPatterns: [],
  },
  responseDefinition: {
    status: 200,
    statusMessage: "OK",
    headers: [],
    body: "",
    fixedDelayMilliseconds: 0,
    transform: false,
  },
  processing: [],
};

describe("BaseResponseRenderer", () => {
  it("should render the response", async () => {
    const renderer = new BaseResponseRenderer();
    const responseDefinition: ResponseDefinition = {
      status: 200,
      statusMessage: "OK",
      headers: [{ name: "Content-Type", value: "text/plain" }],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
    };
    const response: HttpResponse = {
      status: 500,
      statusMessage: "OK",
      headers: [],
      body: "",
    };
    const result = await renderer.render(
      { general: { files: "./a-folder" } } as Configuration,
      MAPPING,
      new Runtime(new Map(), new Map<string, any>()),
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
      statusMessage: "OK",
      headers: [{ name: "Content-Type", value: "text/plain" }],
      body: "Hello World",
    });
  });
});
