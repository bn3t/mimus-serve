import { Configuration } from "../types";
import { loadMappings } from "./mapping";

export const loadConfiguration = async (
  filesDir: string,
  mappingsDir: string,
  transform: boolean,
): Promise<Configuration> => {
  const mappings = await loadMappings(mappingsDir);

  return {
    transform,
    mappings,
    files: filesDir,
  };
};
