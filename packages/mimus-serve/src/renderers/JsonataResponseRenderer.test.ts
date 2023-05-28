import { Runtime } from "../core/runtime";
import {
  Configuration,
  HttpResponse,
  Mapping,
  RequestModel,
  ResponseDefinition,
  UrlMatchType,
} from "../types";
import { evaluateJsonata } from "../utils/jsonata";
import { JsonataResponseRenderer } from "./JsonataResponseRenderer";

const MAPPING: Mapping = {
  id: "test",
  name: "test",
  priority: 0,
  scenarioName: "test",
  requiredScenarioState: "test",
  newScenarioState: "test",
  requestMatch: {
    method: "ANY",
    url: "/",
    urlType: UrlMatchType.Path,
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
        if (jsonataExpression === "theexpression") {
          return "jsonata processed " + jsonataExpression;
        } else {
          return undefined;
        }
      },
    ),
}));

describe("JsonataResponseRenderer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      headers: [],
      body: '"jsonata processed theexpression"',
    });
    expect(evaluateJsonata).toHaveBeenCalledTimes(1);
  });

  it("should return 404 when body is undefined", async () => {
    const renderer = new JsonataResponseRenderer();
    const responseDefinition: ResponseDefinition = {
      status: 200,
      headers: [],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      jsonataExpression: "undefined",
    };
    const response: HttpResponse = {
      status: 200,
      headers: [],
      body: "Hello World",
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
      status: 404,
      statusMessage: "Not Found (jsonata)",
      headers: [],
      body: undefined,
    });
    expect(evaluateJsonata).toHaveBeenCalledTimes(1);
  });
});
