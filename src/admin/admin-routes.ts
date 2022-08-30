import { FastifyInstance } from "fastify";
import swagger, { StaticPathSpec } from "@fastify/swagger";

import { AdminMappingRoutes } from "./admin-mapping-routes";
import { AdminScenariosRoutes } from "./admin-scenarios-routes";

export const AdminRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  fastifyServer.register(swagger, {
    mode: "static",
    routePrefix: "/api-docs",
    exposeRoute: true,
    specification: {
      path: "./src/admin/swagger/dream-mock-admin-api.yaml",
    } as StaticPathSpec,
  });
  fastifyServer.register(AdminScenariosRoutes, { prefix: "/scenarios" });
  fastifyServer.register(AdminMappingRoutes, { prefix: "/mappings" });
};
