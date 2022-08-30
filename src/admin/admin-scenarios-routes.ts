import { FastifyInstance } from "fastify";
import { Runtime } from "../core/runtime";

export const AdminScenariosRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  const server = fastifyServer as FastifyInstance & {
    runtime: Runtime;
  };
  const runtime = server.runtime;
  server.post("/reset", async (_request, _reply) => {
    runtime.resetScenariosStates();
  });
};
