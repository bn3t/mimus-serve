import { FastifyInstance } from "fastify";
import { Runtime } from "../core/runtime";

export const AdminDatasetsRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    runtime: Runtime;
  };
  const runtime = server.runtime;
  server.post("/reset", async (_request, _reply) => {
    runtime.resetDatasets();
  });
  server.get<{
    Params: { name: string };
  }>("/:name", async (request, reply) => {
    const { name } = request.params;
    const dataset = runtime.getDataset(name);
    if (dataset === undefined) {
      await reply.code(404);
    } else {
      await reply.send(dataset);
    }
  });
};
