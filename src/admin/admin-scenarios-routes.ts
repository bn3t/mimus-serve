import { FastifyInstance } from "fastify";
import { Runtime } from "../core/runtime";

type PutRequestBody = {
  state?: string;
};

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
    reply.send(runtime.getScenarios());
  });
  server.put<{ Params: { name: string }; Body: PutRequestBody }>(
    "/:name/state",
    async (request, reply) => {
      console.log("PUT /scenarios/:name/state");
      const { name } = request.params;
      const data = request.body;
      if (!runtime.hasScenario(name)) {
        reply.code(404);
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
