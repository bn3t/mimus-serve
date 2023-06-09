import fastifyStatic from "@fastify/static";
import fastify, { FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import path from "path";

import { AdminRoutes } from "../routes/admin/admin-routes";
import { MockRoutes, Runtime } from "../core";
import { transformScenarioWithState } from "../core/mapping";
import { Configuration, Mapping } from "../types";

/**
 * Configuration options for the logger.
 */
export interface LoggerConfiguration {
  /**
   * The log level to use. Can be one of "fatal", "error", "warn", "info", "debug", or "trace".
   */
  level: string;
  /**
   * Optional transport configuration for the logger.
   */
  transport?: {
    /**
     * The target for the transport. Can be a file path or a URL.
     */
    target: string;
    /**
     * Additional options for the transport.
     */
    options: {
      /**
       * The format for the timestamp in the log messages.
       */
      translateTime: string;
      /**
       * A comma-separated list of log levels to ignore.
       */
      ignore: string;
    };
  };
}

/**
 * Starts the Mimus Serve server with the given configuration, mappings, datasets, and logger.
 * @param configuration The server configuration.
 * @param mappings The mappings to use for the server.
 * @param datasets The datasets to use for the server.
 * @param logger The logger configuration to use for the server.
 */
export const startServer = async (
  configuration: Configuration,
  mappings: Mapping[],
  datasets: Map<string, any>,
  logger: LoggerConfiguration | false,
) => {
  const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
    fastify({
      logger,
    });
  server.decorate("mappings", mappings);
  server.decorate("configuration", configuration);

  server.decorate(
    "runtime",
    new Runtime(transformScenarioWithState(mappings), datasets),
  );
  await server.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/ui",
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
        (address) => !logger && console.info(`server listening on ${address}`),
      );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
