import { Options } from "../types";
import { readYamlFile } from "../utils/files";
import { makeConfiguration } from "./configuration";
import path from "path";

const TEST_CONFIGURATION_YAML = {
  configuration: {
    transform: false,
    files: "./files-config",
    mappings: "./mappings-config",
    datasets: "./datasets-config",
    fixedDelayMilliseconds: 1000,
    cors: {
      origin: false,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: "Content-Type, Authorization",
      exposedHeaders: "Content-Range,X-Content-Range",
      credentials: true,
      maxAge: 1728000,
    },
  },
};

// mock path.resolve
jest.mock("path", () => ({
  resolve: (...args: string[]) => "configdir",
  dirname: (path: string) => path,
}));

// mock the readYamlFile function
jest.mock("../utils/files", () => ({
  readYamlFile: jest
    .fn()
    .mockImplementation((_path: string) => TEST_CONFIGURATION_YAML),
  resolvePath: jest
    .fn()
    .mockImplementation((path1: string, path2: string) => "resolved/" + path2),
}));

describe("Make Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    {
      testname: "take values coming from options",
      options: {
        config: "config1.yaml",
        transform: true,
        files: "./files-options",
        mappings: "./mappings-options",
        datasets: "./datasets-options",
      },
      expected: {
        transform: true,
        files: "./files-options",
        mappings: "./mappings-options",
        datasets: "./datasets-options",
        fixedDelayMilliseconds: 1000,
        cors: {
          origin: false,
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: "Content-Type, Authorization",
          exposedHeaders: "Content-Range,X-Content-Range",
          credentials: true,
          maxAge: 1728000,
        },
      },
    },
    {
      testname: "take values coming from config file",
      options: {
        config: "config1.yaml",
      },
      expected: {
        transform: false,
        files: "resolved/./files-config",
        mappings: "resolved/./mappings-config",
        datasets: "resolved/./datasets-config",
        fixedDelayMilliseconds: 1000,
        cors: {
          origin: false,
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: "Content-Type, Authorization",
          exposedHeaders: "Content-Range,X-Content-Range",
          credentials: true,
          maxAge: 1728000,
        },
      },
    },
    {
      testname: "take values coming from default values when no config file",
      options: {},
      expected: {
        transform: false,
        files: "./files",
        mappings: "./mappings",
        datasets: "./datasets",
        fixedDelayMilliseconds: 0,
        cors: {
          origin: false,
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: undefined,
          exposedHeaders: undefined,
          credentials: undefined,
          maxAge: undefined,
        },
      },
    },
  ])("should $testname", async ({ options, expected }) => {
    const actual = await makeConfiguration(options as Options);
    expect(actual).toEqual(expected);
    expect(readYamlFile).toHaveBeenCalledTimes(options.config ? 1 : 0);
  });
});
