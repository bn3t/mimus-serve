import { FastifyInstance } from "fastify";
// import swagger, { StaticPathSpec } from "@fastify/swagger";

import { AdminMappingRoutes } from "./admin-mapping-routes";
import { AdminScenariosRoutes } from "./admin-scenarios-routes";
import { AdminDatasetsRoutes } from "./admin-datasets-routes";
import { AdminSettingsRoutes } from "./admin-settings-routes";

/**
 * Registers the admin routes for the Fastify server instance.
 * @param fastifyServer - The Fastify server instance.
 * @param _options - Any options to pass to the registration.
 */
export const AdminRoutes = async (
  fastifyServer: FastifyInstance,
  _options: any,
) => {
  await fastifyServer.register(AdminScenariosRoutes, { prefix: "/scenarios" });
  await fastifyServer.register(AdminSettingsRoutes, { prefix: "/settings" });
  await fastifyServer.register(AdminDatasetsRoutes, { prefix: "/datasets" });
  await fastifyServer.register(AdminMappingRoutes, { prefix: "/mappings" });
};
