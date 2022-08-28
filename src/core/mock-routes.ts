import { FastifyInstance } from "fastify";
import { Configuration } from "../types";
import { processRequest } from "./engine";

export const MockRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    configuration: Configuration;
  };
  const configuration = server.configuration;

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
      request.raw,
      reply.raw,
      request.body,
      isHttps,
    );
  });
};
