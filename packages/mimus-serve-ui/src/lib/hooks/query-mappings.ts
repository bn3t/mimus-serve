import mimusServeAdmin from "$lib/api/mimus-serve-admin";
import { useQuery } from "@tanstack/react-query";

export const useMappingsQuery = () => {
  return useQuery(["mappings"], mimusServeAdmin.getMappings);
};

export const useMappingByIdQuery = (mappingId: string | undefined) => {
  return useQuery(["mapping", mappingId], () =>
    mappingId ? mimusServeAdmin.getMappingById(mappingId) : undefined,
  );
};
