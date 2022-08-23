/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ServerResponse } from "http";
import { processRequest } from "./engine";
import { Mapping, UrlMatchType } from "./types";

import { findMapping } from "./mapping";
import { readFile } from "./utils/files";

const MOCK_MAPPINGS: Mapping[] = [
  {
    priority: 0,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/url-to-match-method-02",
        method: "GET",
      },
    ],
    responseDefinition: {
      status: 200,
      statusMessage: "All is ok",
      headers: [{ name: "Content-Type", value: "application/json" }],
      body: "match 02",
    },
  },
  {
    priority: 0,
    requestMatches: [
      {
        urlType: UrlMatchType.Path,
        url: "/url-to-match-method-02",
        method: "GET",
      },
    ],
    responseDefinition: {
      status: 200,
      statusMessage: "All is ok",
      headers: [{ name: "Content-Type", value: "application/json" }],
      bodyFileName: "match 02",
    },
  },
];

jest.mock("./mapping", () => ({
  findMapping: jest.fn().mockImplementation(() => MOCK_MAPPINGS[1]),
}));
jest.mock("./utils/files", () => ({
  readFile: jest
    .fn()
    .mockImplementation(
      async (filename: string) => `read file content ${filename}`,
    ),
}));

describe("Engine - case find mapping body file name", () => {
  test("should process a request - body file name", async () => {
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
    };
    // const serverResponse = jest.mock(ServerResponse);
    await processRequest(
      MOCK_MAPPINGS,
      //@ts-ignore
      { url: "blah", headers: [] },
      serverResponse,
    );
    expect(findMapping).toHaveBeenCalledTimes(1);
    expect(serverResponse.write).toHaveBeenCalledTimes(1);
    expect(serverResponse.write).toHaveBeenCalledWith(
      "read file content match 02",
      expect.anything(),
    );
  });
});
