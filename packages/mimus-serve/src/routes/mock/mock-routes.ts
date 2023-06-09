import { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

import { Configuration } from "../../types";
import { processRequest } from "../../core/engine";
import { Runtime } from "../../core/runtime";

/**
 * Registers mock routes on the provided Fastify server instance.
 * These routes have to use a specific content type parser to be able to
 * process the request body correctly (that means without processing it).
 * @param fastifyServer - The Fastify server instance to register the mock routes on.
 * @param _options - Any additional options to pass to the function.
 */
export const MockRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    configuration: Configuration;
    runtime: Runtime;
    mappings: any[];
  };
  const { configuration, runtime, mappings } = server;

  await server.register(cors, {
    origin: configuration.cors.origin,
    methods: configuration.cors.methods,
    allowedHeaders: configuration.cors.allowedHeaders,
    exposedHeaders: configuration.cors.exposedHeaders,
    credentials: configuration.cors.credentials,
    maxAge: configuration.cors.maxAge,
  });
  await server.register(cookie, {
    hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    parseOptions: {}, // options for parsing cookies
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

  server.addContentTypeParser(
    ["application/pdf"],
    { parseAs: "buffer" },
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

  server.route({
    method: [
      "DELETE",
      "GET",
      "HEAD",
      "PATCH",
      "POST",
      "PUT",
      "SEARCH",
      "TRACE",
      "PROPFIND",
      "PROPPATCH",
      "MKCOL",
      "COPY",
      "MOVE",
      "LOCK",
      "UNLOCK",
    ],
    url: "/*",
    handler: async (request, reply) => {
      const isHttps = server.initialConfig.https === true;
      // reply.hijack();
      await processRequest(
        configuration,
        mappings,
        runtime,
        request.raw,
        request.cookies,
        reply,
        request.body,
        isHttps,
      );
    },
  });
};
