import path from "path";
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import "dotenv/config";
import { IncomingMessage, Server, ServerResponse } from "http";
import { fastify, FastifyInstance } from "fastify";
import { loadConfiguration } from "./core/mapping";
import { MockRoutes } from "./core/mock-routes";
import { AdminRoutes } from "./admin/admin-routes";

const environment = process.env.NODE_ENV ?? "production";
const currentDirectory = process.cwd();

type Options = {
  help?: boolean;
  port?: number;
  host?: string;
  logger?: string;
  files: string;
  mappings: string;
};

const optionDefinitions = [
  {
    name: "help",
    description: "Display this usage guide.",
    alias: "h",
    type: Boolean,
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
];

const optionUsage = [
  {
    header: "Dream Mock Server",
    content: "Dream Mock Server",
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

if (options !== undefined) {
  options.files = path.resolve(path.normalize(currentDirectory), options.files);
  options.mappings = path.resolve(
    path.normalize(currentDirectory),
    options.mappings,
  );

  const logger =
    options?.logger !== undefined
      ? {
          level: options.logger,
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
  const start = async () => {
    if (options === undefined) {
      throw new Error("options is undefined");
    }
    const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
      fastify({
        logger,
      });
    server.decorate(
      "configuration",
      await loadConfiguration(options.files, options.mappings),
    );
    server.register(AdminRoutes, { prefix: "/__admin" });
    server.register(MockRoutes);
    try {
      const host = options.host !== undefined ? { host: options.host } : {};
      await server
        .listen({ port: options?.port ?? 4000, ...host })
        .then(
          (address) =>
            !logger && console.info(`server listening on ${address}`),
        );
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };
  start().catch(console.error);
} else {
  const usage = commandLineUsage(optionUsage);
  console.error(usage);
}
