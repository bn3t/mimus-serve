import path from "path";
import { Configuration, Options } from "../types";
import { readYamlFile, resolvePath } from "../utils/files";

// return a configuraiton object based on options and on the content of the configuration file
export const makeConfiguration = async (
  options: Options,
): Promise<Configuration> => {
  let configFromYaml: Configuration | undefined;

  if (options.config !== undefined) {
    // load the configuration file
    const config = await readYamlFile<{ configuration: Configuration }>(
      options.config,
    );
    if (config !== undefined && config.configuration !== undefined) {
      const configdir = path.dirname(options.config);
      configFromYaml = {
        ...config.configuration,
        mappings: resolvePath(
          path.resolve(".", configdir),
          config.configuration.mappings,
        ),
        files: resolvePath(
          path.resolve(".", configdir),
          config.configuration.files,
        ),
        datasets: resolvePath(
          path.resolve(".", configdir),
          config.configuration.datasets,
        ),
      };
    }
  }

  const configuration: Configuration = {
    transform: options.transform ?? configFromYaml?.transform ?? false,
    files: options.files ?? configFromYaml?.files ?? "./files",
    mappings: options.mappings ?? configFromYaml?.mappings ?? "./mappings",
    datasets: options.datasets ?? configFromYaml?.datasets ?? "./datasets",
    cors: {
      origin: configFromYaml?.cors.origin ?? false,
      methods: configFromYaml?.cors.methods ?? ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: configFromYaml?.cors?.allowedHeaders,
      exposedHeaders: configFromYaml?.cors.exposedHeaders,
      credentials: configFromYaml?.cors.credentials,
      maxAge: configFromYaml?.cors.maxAge,
    },
  };
  return configuration;
};
