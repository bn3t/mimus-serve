import { FastifyInstance } from "fastify";

import { Configuration, Mapping } from "../types";

interface GetMappingsQuery {
  limit?: number;
  offset?: number;
}

// convert one mapping
const convertMapping = (mapping: Mapping): any => ({
  ...mapping,
  requestMatch: undefined,
  responseDefinition: undefined,
  request: mapping.requestMatch,
  response: mapping.responseDefinition,
});

const convertMappings = (mappings: Mapping[]): any[] =>
  mappings.map((mapping) => convertMapping(mapping));

export const AdminMappingRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    configuration: Configuration;
  };
  const configuration = server.configuration;
  server.get<{ Querystring: GetMappingsQuery }>(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
      },
    },
    async (request, reply) => {
      const { limit, offset } = request.query;
      let filteredMappings;
      if (limit !== undefined || offset !== undefined) {
        const normalizedOffset = offset !== undefined ? offset : 0;
        const normalizedLimit =
          limit !== undefined ? normalizedOffset + limit : undefined;
        filteredMappings = configuration.mappings.slice(
          normalizedOffset,
          normalizedLimit,
        );
      } else {
        filteredMappings = configuration.mappings;
      }
      reply.send({
        meta: {
          total: filteredMappings.length,
        },
        mappings: convertMappings(filteredMappings),
      });
    },
  );
  server.get<{
    Params: { mappingId: string };
  }>("/:mappingId", async (request, reply) => {
    const { mappingId } = request.params;
    const mapping = configuration.mappings.find(
      (mapping) => mapping.id === mappingId,
    );
    if (mapping === undefined) {
      reply.code(404);
    } else {
      reply.send(convertMapping(mapping));
    }
  });
};
