import { FastifyInstance } from "fastify";
import { Configuration } from "../../types";

/**
 * Defines the shape of the request body for the admin settings PATCH route.
 */
type PostRequestBody = {
  fixedDelayMilliseconds: number;
};

/**
 * Defines the admin settings routes for the Fastify server.
 * @param fastifyServer - The Fastify server instance.
 * @param _options - The options object.
 */
export const AdminSettingsRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    configuration: Configuration;
  };
  const { configuration } = server;
  server.get("/", async (_request, reply) => {
    await reply.send(configuration);
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
      await reply.send({ fixedDelayMilliseconds });
    },
  );
};
