import { FastifyInstance } from "fastify";
// import swagger, { StaticPathSpec } from "@fastify/swagger";

import { AdminMappingRoutes } from "./admin-mapping-routes";
import { AdminScenariosRoutes } from "./admin-scenarios-routes";
import { AdminDatasetsRoutes } from "./admin-datasets-routes";
import { AdminSettingsRoutes } from "./admin-settings-routes";

export const AdminRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  // fastifyServer.register(swagger, {
  //   mode: "static",
  //   routePrefix: "/api-docs",
  //   exposeRoute: true,
  //   specification: {
  //     path: "./src/admin/swagger/mimus-serve-admin-api.yaml",
  //   } as StaticPathSpec,
  // });
  await fastifyServer.register(AdminScenariosRoutes, { prefix: "/scenarios" });
  await fastifyServer.register(AdminSettingsRoutes, { prefix: "/settings" });
  await fastifyServer.register(AdminDatasetsRoutes, { prefix: "/datasets" });
  await fastifyServer.register(AdminMappingRoutes, { prefix: "/mappings" });
};
