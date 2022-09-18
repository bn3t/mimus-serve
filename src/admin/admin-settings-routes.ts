import { FastifyInstance } from "fastify";
import { Configuration } from "../types";

type PostRequestBody = {
  fixedDelayMilliseconds: number;
};

export const AdminSettingsRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    configuration: Configuration;
  };
  const { configuration } = server;
  server.get("/", async (_request, reply) => {
    reply.send(configuration);
  });
  server.patch<{ Body: PostRequestBody }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            fixedDelayMilliseconds: { type: "integer" },
          },
        },
      },
    },
    async (request, reply) => {
      const { fixedDelayMilliseconds } = request.body;
      configuration.general.fixedDelayMilliseconds = fixedDelayMilliseconds;
      reply.send({ fixedDelayMilliseconds });
    },
  );
};
