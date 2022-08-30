import { FastifyInstance } from "fastify";
import { Configuration } from "../types";
import { processRequest } from "./engine";
import { Runtime } from "./runtime";

export const MockRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    configuration: Configuration;
    runtime: Runtime;
  };
  const { configuration, runtime } = server;

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

  server.all("/*", async (request, reply) => {
    const isHttps = server.initialConfig.https === true;
    reply.hijack();
    await processRequest(
      configuration,
      runtime,
      request.raw,
      reply.raw,
      request.body,
      isHttps,
    );
  });
};
