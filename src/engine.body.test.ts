/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ServerResponse } from "http";
import { processRequest } from "./engine";
import { Mapping, UrlMatchType } from "./types";

import { findMapping } from "./mapping";
import { buildRequestModel } from "./utils/request";

const MOCK_MAPPINGS: Mapping[] = [
  {
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-02",
      method: "GET",
      queryParameters: [],
      headers: [],
      bodyPatterns: [],
    },

    responseDefinition: {
      status: 200,
      statusMessage: "All is ok",
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 02",
      fixedDelayMilliseconds: 0,
      transform: false,
    },
  },
  {
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-02",
      method: "GET",
      queryParameters: [],
      headers: [],
      bodyPatterns: [],
    },

    responseDefinition: {
      status: 200,
      statusMessage: "All is ok",
      headers: [{ name: "Content-Type", value: "application/json" }],
      bodyFileName: "match 02",
      fixedDelayMilliseconds: 0,
      transform: false,
    },
  },
];

jest.mock("./utils/request", () => ({
  buildRequestModel: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("./mapping", () => ({
  findMapping: jest.fn().mockImplementation(() => MOCK_MAPPINGS[0]),
}));

describe("Engine - case find mapping body", () => {
  test("should process a request", async () => {
    //@ts-ignore
    const serverResponse: ServerResponse = {
      statusCode: 200,
      //@ts-ignore
      write: jest
        .fn()
        .mockImplementation((data: unknown, cb: (error: unknown) => void) =>
          cb(null),
        ),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
    // const serverResponse = jest.mock(ServerResponse);
    await processRequest(
      MOCK_MAPPINGS,
      //@ts-ignore
      { url: "http://localhost:4000/test/path", headers: [], method: "GET" },
      serverResponse,
      "",
      false,
    );
    expect(findMapping).toHaveBeenCalledTimes(1);
    expect(buildRequestModel).toHaveBeenCalledTimes(1);
  });
});
