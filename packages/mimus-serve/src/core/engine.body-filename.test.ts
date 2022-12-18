/* eslint-disable @typescript-eslint/ban-ts-comment */
import { processRequest } from "./engine";
import { Configuration, Mapping, UrlMatchType } from "../types";

import { findMapping } from "./mapping";
import { buildRequestModel } from "../utils/request";
import { Runtime } from "./runtime";

const MOCK_MAPPINGS: Mapping[] = [
  {
    id: "51111A10-9016-4426-93D8-9C7C5897707F",
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-02",
      method: "GET",
      queryParameters: [],
      headers: [],
      cookies: [],
      bodyPatterns: [],
    },
    processing: [],
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
    id: "51111A10-9016-4426-93D8-9C7C5897707F",
    priority: 0,
    requestMatch: {
      urlType: UrlMatchType.Path,
      url: "/url-to-match-method-02",
      method: "GET",
      queryParameters: [],
      headers: [],
      cookies: [],
      bodyPatterns: [],
    },
    processing: [],
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

jest.mock("../utils/request", () => ({
  buildRequestModel: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("./mapping", () => ({
  findMapping: jest.fn().mockImplementation(() => MOCK_MAPPINGS[1]),
}));
jest.mock("../utils/files", () => ({
  readFile: jest
    .fn()
    .mockImplementation(
      async (parentDir: string, filename: string) =>
        `read file content ${filename}`,
    ),
}));

describe("Engine - case find mapping body file name", () => {
  test("should process a request - body file name", async () => {
    //@ts-ignore
    const reply: FastifyReply = {
      statusCode: 200,
      code: jest.fn().mockImplementation(() => reply),
      //@ts-ignore
      send: jest.fn().mockImplementation(() => reply),
      header: jest.fn(),
    };
    await processRequest(
      {
        general: {
          files: "./files",
          transform: false,
        },
      } as Configuration,
      MOCK_MAPPINGS,
      new Runtime(new Map(), new Map<string, any>()),
      {
        url: "http://localhost:4000/test/path",
        //@ts-ignore
        headers: [],
        method: "GET",
      },
      {},
      reply,
      "",
      false,
    );
    expect(findMapping).toHaveBeenCalledTimes(1);
    expect(reply.send).toHaveBeenCalledTimes(1);
    expect(reply.send).toHaveBeenCalledWith("read file content match 02");
    expect(buildRequestModel).toHaveBeenCalledTimes(1);
  });
});
