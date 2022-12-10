import { Options } from "../types";
import { readYamlFile } from "../utils/files";
import { makeConfiguration } from "./configuration";

const TEST_CONFIGURATION_YAML = {
  general: {
    transform: false,
    files: "./files-config",
    mappings: "./mappings-config",
    datasets: "./datasets-config",
    fixedDelayMilliseconds: 1000,
  },
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization",
    exposedHeaders: "Content-Range,X-Content-Range",
    credentials: true,
    maxAge: 1728000,
  },
};

const TEST_CONFIGURATION_YAML_NO_CORS = {
  general: {
    transform: false,
    files: "./files-config",
    mappings: "./mappings-config",
    datasets: "./datasets-config",
    fixedDelayMilliseconds: 1000,
  },
};

// mock path.resolve
jest.mock("path", () => ({
  resolve: (..._args: string[]) => "configdir",
  dirname: (path: string) => path,
}));

// mock the readYamlFile function
jest.mock("../utils/files", () => ({
  readYamlFile: jest
    .fn()
    .mockImplementation((path: string) =>
      path === "config-nocors.yaml"
        ? TEST_CONFIGURATION_YAML_NO_CORS
        : TEST_CONFIGURATION_YAML,
    ),
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
        general: {
          host: "localhost",
          port: 4000,
          transform: true,
          files: "./files-options",
          mappings: "./mappings-options",
          datasets: "./datasets-options",
          fixedDelayMilliseconds: 1000,
        },
        logging: {
          logger: undefined,
        },

        cors: {
          origin: "http://localhost:3000",
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
        general: {
          host: "localhost",
          port: 4000,
          transform: false,
          files: "resolved/./files-config",
          mappings: "resolved/./mappings-config",
          datasets: "resolved/./datasets-config",
          fixedDelayMilliseconds: 1000,
        },
        logging: {
          logger: undefined,
        },
        cors: {
          origin: "http://localhost:3000",
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: "Content-Type, Authorization",
          exposedHeaders: "Content-Range,X-Content-Range",
          credentials: true,
          maxAge: 1728000,
        },
      },
    },
    {
      testname: "take values coming from config file - no cors setup",
      options: {
        config: "config-nocors.yaml",
      },
      expected: {
        general: {
          host: "localhost",
          port: 4000,
          transform: false,
          files: "resolved/./files-config",
          mappings: "resolved/./mappings-config",
          datasets: "resolved/./datasets-config",
          fixedDelayMilliseconds: 1000,
        },
        logging: {
          logger: undefined,
        },

        cors: {
          origin: false,
          methods: [],
        },
      },
    },
    {
      testname: "take values coming from default values when no config file",
      options: {},
      expected: {
        general: {
          host: "localhost",
          port: 4000,
          transform: false,
          files: "./files",
          mappings: "./mappings",
          datasets: "./datasets",
          fixedDelayMilliseconds: 0,
        },
        logging: {
          logger: undefined,
        },
        cors: {
          origin: false,
          methods: [],
        },
      },
    },
  ])("should $testname", async ({ options, expected }) => {
    const actual = await makeConfiguration(options as Options);
    expect(actual).toEqual(expected);
    expect(readYamlFile).toHaveBeenCalledTimes(options.config ? 1 : 0);
  });
});
