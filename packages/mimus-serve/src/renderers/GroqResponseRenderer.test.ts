import { Runtime } from "../core/runtime";
import {
  Configuration,
  HttpResponse,
  Mapping,
  RequestModel,
  ResponseDefinition,
  UrlMatchType,
} from "../types";
import { evaluateGroq } from "../utils/groq";
import { GroqResponseRenderer } from "./GroqResponseRenderer";

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

// mock evaluateGroq with jest
jest.mock("../utils/groq", () => ({
  evaluateGroq: jest
    .fn()
    .mockImplementation(
      (groqExpression: string, _data: any, _bindings?: Record<string, any>) => {
        if (groqExpression === "theexpression") {
          return "groq processed " + groqExpression;
        } else {
          return undefined;
        }
      },
    ),
}));

describe("GroqResponseRenderer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the response", async () => {
    const renderer = new GroqResponseRenderer();
    const responseDefinition: ResponseDefinition = {
      status: 200,
      headers: [],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      groqExpression: "theexpression",
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
      body: '"groq processed theexpression"',
    });
    expect(evaluateGroq).toHaveBeenCalledTimes(1);
  });

  it("should return 404 when body is undefined", async () => {
    const renderer = new GroqResponseRenderer();
    const responseDefinition: ResponseDefinition = {
      status: 200,
      headers: [],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      groqExpression: "undefined",
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
      statusMessage: "Not Found (groq)",
      headers: [],
      body: undefined,
    });
    expect(evaluateGroq).toHaveBeenCalledTimes(1);
  });
});
