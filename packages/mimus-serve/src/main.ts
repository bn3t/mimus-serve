#!/usr/bin/env node
import commandLineArgs, { OptionDefinition } from "command-line-args";
import commandLineUsage from "command-line-usage";
import "dotenv/config";
import { dump } from "js-yaml";
import path from "path";

import { makeConfiguration } from "./configuration/configuration";
import { loadDatasets, loadMappings } from "./core";
import { LoggerConfiguration, startServer } from "./server/server";
import { Options } from "./types";

const environment = process.env.NODE_ENV ?? "production";
const currentDirectory = process.cwd();
const banner = String.raw`
__  __ _                ___                  
|  \/  (_)_ __ _  _ ___ / __| ___ _ ___ _____ 
| |\/| | | '  \ || (_-< \__ \/ -_) '_\ V / -_)
|_|  |_|_|_|_|_\_,_/__/ |___/\___|_|  \_/\___|
                                              
`;

const optionDefinitions = [
  {
    name: "help",
    description: "Display this usage guide.",
    alias: "h",
    type: Boolean,
    defaultValue: false,
  },
  {
    name: "verbose",
    description: "Set verbose output",
    alias: "v",
    type: Boolean,
    defaultValue: false,
  },
  {
    name: "config",
    description: "Path to the configuration file.",
    alias: "c",
    type: String,
  },
  {
    name: "port",
    alias: "p",
    description: "Specify the port to listen on.",
    type: Number,
  },
  {
    name: "host",
    alias: "H",
    description: "Specify the host to listen on.",
    type: String,
  },
  {
    name: "logger",
    alias: "l",
    description: "Specify the logger to use.",
    type: String,
  },
  {
    name: "files",
    alias: "f",
    description: "Specify the path where files are located (from bodyFileName)",
    type: String,
  },
  {
    name: "mappings",
    alias: "m",
    description: "Specify the path mappings are located",
    type: String,
  },
  {
    name: "datasets",
    alias: "d",
    description: "Specify the path datasets are located",
    type: String,
  },
  {
    name: "transform",
    alias: "t",
    description: "Force transforming responses using templating",
    type: Boolean,
  },
];

const optionUsage = [
  {
    header: "Mimus Serve",
    content: "Mimus Serve",
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
];

const makeOptions = (
  optionDefinitions: OptionDefinition[],
): Options | undefined => {
  let options: Options | undefined;
  try {
    options = commandLineArgs(optionDefinitions) as Options;
  } catch (error) {
    // ignore
    console.error("Unrecognised option");
  }
  return options;
};

const options = makeOptions(optionDefinitions);

if (options === undefined || options.help) {
  console.info(commandLineUsage(optionUsage));
  process.exit(1);
}

const start = async () => {
  if (options === undefined) {
    throw new Error("options is undefined");
  }
  const configuration = await makeConfiguration(options);
  const logger: LoggerConfiguration | false =
    configuration.logging.logger !== undefined
      ? {
          level: configuration.logging.logger,
          transport:
            environment === "development"
              ? {
                  target: "pino-pretty",
                  options: {
                    translateTime: "HH:MM:ss Z",
                    ignore: "pid,hostname",
                  },
                }
              : undefined,
        }
      : false;
  configuration.general.files = path.resolve(
    path.normalize(currentDirectory),
    configuration.general.files,
  );
  configuration.general.mappings = path.resolve(
    path.normalize(currentDirectory),
    configuration.general.mappings,
  );
  console.info(banner);
  if (options.verbose) {
    console.info("configuration:\n\n", dump(configuration));
  }
  const mappings = await loadMappings(configuration.general.mappings);
  const datasets = await loadDatasets(configuration.general.datasets);

  await startServer(configuration, mappings, datasets, logger);
};
start().catch((e) => {
  console.error(e.message);
});
