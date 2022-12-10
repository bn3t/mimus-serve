#!/usr/bin/env node
import { fastify, FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import "dotenv/config";
import { IncomingMessage, Server, ServerResponse } from "http";
import { MockRoutes, Runtime, loadDatasets, loadMappings } from "./core";
import { AdminRoutes } from "./admin/admin-routes";
import { Options } from "./types";
import { makeConfiguration } from "./configuration/configuration";
import { dump } from "js-yaml";

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

let options: Options | undefined;
try {
  options = commandLineArgs(optionDefinitions) as Options;
} catch (error) {
  // ignore
  console.error("Unrecognised option");
}

if (options !== undefined && !options.help) {
  const start = async () => {
    if (options === undefined) {
      throw new Error("options is undefined");
    }
    const configuration = await makeConfiguration(options);
    const logger =
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
    const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
      fastify({
        logger,
      });
    const mappings = await loadMappings(configuration.general.mappings);
    const datasets = await loadDatasets(configuration.general.datasets);

    server.decorate("mappings", mappings);
    server.decorate("configuration", configuration);
    server.decorate(
      "runtime",
      new Runtime(
        mappings
          .map((mapping) => mapping.scenarioName)
          .filter((scenarioName) => scenarioName !== undefined) as string[],
        datasets,
      ),
    );
    console.log(path.join(__dirname, "../dist", "public"));
    // @ts-ignore
    await server.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
      prefix: "/ui", // optional: default '/'
      list: true,
    });
    await server.register(AdminRoutes, { prefix: "/__admin" });
    await server.register(MockRoutes);
    try {
      await server
        .listen({
          port: configuration.general.port,
          host: configuration.general.host,
        })
        .then(
          (address) =>
            !logger && console.info(`server listening on ${address}`),
        );
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };
  start().catch((e) => {
    console.error(e.message);
  });
} else {
  const usage = commandLineUsage(optionUsage);
  console.error(usage);
}
