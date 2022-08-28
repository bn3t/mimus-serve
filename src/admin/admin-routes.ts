import { FastifyInstance } from "fastify";
import swagger, { StaticPathSpec } from "@fastify/swagger";

import { AdminMappingRoutes } from "./admin-mapping-routes";

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
  fastifyServer.register(AdminMappingRoutes, { prefix: "/mappings" });
};
