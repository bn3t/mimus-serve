import { FastifyInstance } from "fastify";
import { Runtime } from "../../core/runtime";

/**
 * The request body for the PUT /:name/state route.
 */
type PutRequestBody = {
  state?: string;
};

/**
 * Defines the routes for the admin scenarios.
 * @param fastifyServer - The Fastify server instance.
 * @param _options - The options object.
 */
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
  server.get("/", async (_request, reply) => {
    await reply.send(runtime.getScenarios());
  });
  server.put<{ Params: { name: string }; Body: PutRequestBody }>(
    "/:name/state",
    async (request, reply) => {
      const { name } = request.params;
      const data = request.body;
      if (!runtime.hasScenario(name)) {
        await reply.code(404);
      } else {
        if (data.state !== undefined) {
          runtime.changeScenarioState(name, data.state);
        } else {
          runtime.startScenario(name);
        }
      }
    },
  );
};
