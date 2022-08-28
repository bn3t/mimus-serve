import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";
import "dotenv/config";
import { IncomingMessage, Server, ServerResponse } from "http";
import { fastify, FastifyInstance } from "fastify";
import { processRequest } from "./engine";
import { loadConfiguration } from "./mapping";

const environment = process.env.NODE_ENV ?? "production";

type Options = {
  help?: boolean;
  port?: number;
  host?: string;
  logger?: string;
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

if (options === undefined || options["help"]) {
  const usage = commandLineUsage(optionUsage);
  console.error(usage);
} else {
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
    const configuration = await loadConfiguration();
    const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
      fastify({
        logger,
      });
    server.addContentTypeParser(
      ["application/json", "application/x-www-form-urlencoded"],
      { parseAs: "string" },
      function (req, body, done) {
        try {
          done(null, body);
        } catch (err) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          err.statusCode = 400;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          done(err, undefined);
        }
      },
    );
    server.get("/__admin", async (request, reply) => {
      reply.send("Admin routes");
    });
    server.all("/*", async (request, reply) => {
      const isHttps = server.initialConfig.https === true;
      reply.hijack();
      await processRequest(
        configuration.mappings,
        request.raw,
        reply.raw,
        request.body,
        isHttps,
      );
    });
    try {
      const host = options?.host !== undefined ? { host: options.host } : {};
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
}
