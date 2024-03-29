/* eslint-disable @typescript-eslint/no-floating-promises */
import { Runtime } from "../core/runtime";
import {
  Configuration,
  Mapping,
  OutputProcessingOperation,
  ProcessingDefinition,
  RequestModel,
  UrlMatchType,
} from "../types";
import { evaluateJsonata } from "../utils/jsonata";
import {
  ProcessingResponseRenderer,
  replaceMatchingObjectInArray,
} from "./ProcessingResponseRenderer";

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

describe("ProcessingResponseRenderer", () => {
  test("should throw dataset is not found", async () => {
    const renderer = new ProcessingResponseRenderer();
    const responseDefinition = {
      status: 200,
      statusMessage: "OK",
      headers: [{ name: "Content-Type", value: "text/plain" }],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      processing: {
        operation: "test",
        arguments: {
          a: 1,
        },
      },
    };
    const response = {
      status: 200,
      statusMessage: "OK",
      headers: [],
    };
    const datasets = new Map([["test", [{ a: 1 }]]]);

    const processing: ProcessingDefinition[] = [
      {
        type: "input",
        dataset: "notexist",
        expression: "$",
      },
      {
        type: "match",
        expression: "a",
      },
      {
        type: "output",
        operation: "replaceWithRequestBody",
      },
    ] as ProcessingDefinition[];
    const mapping = {
      ...MAPPING,
      processing,
    };

    expect(
      renderer.render(
        { general: { files: "./a-folder" } } as Configuration,
        mapping,
        new Runtime(new Map(), datasets),
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
            body: '{ "a": 1 }',
          } as RequestModel,
        },
        response,
      ),
    ).rejects.toThrow("Dataset notexist is not defined");
  });

  test("should throw dataset is not specified", async () => {
    const renderer = new ProcessingResponseRenderer();
    const responseDefinition = {
      status: 200,
      statusMessage: "OK",
      headers: [{ name: "Content-Type", value: "text/plain" }],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      processing: {
        operation: "test",
        arguments: {
          a: 1,
        },
      },
    };
    const response = {
      status: 200,
      statusMessage: "OK",
      headers: [],
    };
    const datasets = new Map([["test", [{ a: 1 }]]]);

    const processing: ProcessingDefinition[] = [
      {
        type: "input",
        dataset: undefined,
        expression: "$",
      },
      {
        type: "match",
        expression: "a",
      },
      {
        type: "output",
        operation: "replaceWithRequestBody",
      },
    ] as ProcessingDefinition[];
    const mapping = {
      ...MAPPING,
      processing,
    };

    expect(
      renderer.render(
        { general: { files: "./a-folder" } } as Configuration,
        mapping,
        new Runtime(new Map(), datasets),
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
            body: '{ "a": 1 }',
          } as RequestModel,
        },
        response,
      ),
    ).rejects.toThrow("Dataset should be defined for input processing");
  });

  test("should render the response", async () => {
    const renderer = new ProcessingResponseRenderer();
    const responseDefinition = {
      status: 200,
      statusMessage: "OK",
      headers: [{ name: "Content-Type", value: "text/plain" }],
      body: "Hello World",
      fixedDelayMilliseconds: 0,
      transform: false,
      processing: {
        operation: "test",
        arguments: {
          a: 1,
        },
      },
    };
    const response = {
      status: 200,
      statusMessage: "OK",
      headers: [],
    };
    const datasets = new Map([["test", [{ a: 1 }]]]);

    const processing: ProcessingDefinition[] = [
      {
        type: "input",
        dataset: "test",
        expression: "$",
        groqExpression: undefined,
      },
      {
        type: "match",
        expression: "a",
        output: "match",
        groqExpression: undefined,
      },
      {
        type: "store",
        operation: "replaceWithRequestBody",
        input: "input",
        output: "output",
        match: "match",
      },
    ];
    const mapping = {
      ...MAPPING,
      processing,
    };

    const result = await renderer.render(
      { general: { files: "./a-folder" } } as Configuration,
      mapping,
      new Runtime(new Map(), datasets),
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
          body: '{ "a": 1 }',
        } as RequestModel,
      },
      response,
    );
    expect(result).toEqual({ headers: [], status: 200, statusMessage: "OK" });
    expect(evaluateJsonata).toHaveBeenCalledTimes(1);
  });
});

describe("replaceMatchingObjectInArray", () => {
  test("should throw if the operation is not known", () => {
    expect(() =>
      replaceMatchingObjectInArray(
        [
          {
            a: 1,
          },
        ],
        { a: 1 },
        { b: 2 },
        "unknown" as OutputProcessingOperation,
      ),
    ).toThrow();
  });

  test.each([
    {
      testname: "replace the matching object in the array",
      array: [{ a: 1 }, { a: 2 }],
      objectToMatch: { a: 2 },
      objectToReplace: { b: 4 },
      operation: "replaceWithRequestBody" as OutputProcessingOperation,
      expectedResut: [[{ a: 1 }, { b: 4 }], { b: 4 }],
    },
    {
      testname: "merge the matching object in the array",
      array: [{ a: 1 }, { a: 2 }],
      objectToMatch: { a: 2 },
      objectToReplace: { b: 4 },
      operation: "mergeWithRequestBody" as OutputProcessingOperation,
      expectedResut: [[{ a: 1 }, { a: 2, b: 4 }], { a: 2, b: 4 }],
    },
    {
      testname: "delete the matching object in the array",
      array: [{ a: 1 }, { a: 2 }],
      objectToMatch: { a: 2 },
      objectToReplace: undefined,
      operation: "deleteMatching" as OutputProcessingOperation,
      expectedResut: [[{ a: 1 }], undefined],
    },
    {
      testname: "insert the matching object in the array",
      array: [{ a: 1 }, { a: 2 }],
      objectToMatch: undefined,
      objectToReplace: { a: 3 },
      operation: "insertRequestBody" as OutputProcessingOperation,
      expectedResut: [[{ a: 1 }, { a: 2 }, { a: 3 }], { a: 3 }],
    },
  ])(
    "should $testname",
    ({ array, objectToMatch, objectToReplace, operation, expectedResut }) => {
      const result = replaceMatchingObjectInArray(
        array,
        objectToMatch,
        objectToReplace,
        operation,
      );
      expect(result).toEqual(expectedResut);
    },
  );
});
