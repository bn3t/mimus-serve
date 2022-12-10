import path from "path";
import { Configuration, Options } from "../types";
import { readYamlFile, resolvePath } from "../utils/files";
import { DeepPartial } from "../utils/types";

// return a configuraiton object based on options and on the content of the configuration file
export const makeConfiguration = async (
  options: Options,
): Promise<Configuration> => {
  let configFromYaml: DeepPartial<Configuration> | undefined = undefined;

  if (options.config !== undefined) {
    const config = await readYamlFile<DeepPartial<Configuration>>(
      options.config,
    );
    if (config !== undefined) {
      const configdir = path.dirname(options.config);
      configFromYaml = {
        ...config,
        general: {
          ...config?.general,
          mappings: config.general?.mappings
            ? resolvePath(path.resolve(".", configdir), config.general.mappings)
            : undefined,
          files: config.general?.files
            ? resolvePath(path.resolve(".", configdir), config.general.files)
            : undefined,
          datasets: config.general?.datasets
            ? resolvePath(path.resolve(".", configdir), config.general.datasets)
            : undefined,
        },
      };
    }
  }

  const configuration: Configuration = {
    general: {
      port: options.port ?? configFromYaml?.general?.port ?? 4000,
      host: options.host ?? configFromYaml?.general?.host ?? "localhost",
      transform:
        options.transform ?? configFromYaml?.general?.transform ?? false,
      files: options.files ?? configFromYaml?.general?.files ?? "./files",
      mappings:
        options.mappings ?? configFromYaml?.general?.mappings ?? "./mappings",
      datasets:
        options.datasets ?? configFromYaml?.general?.datasets ?? "./datasets",
      fixedDelayMilliseconds:
        configFromYaml?.general?.fixedDelayMilliseconds ?? 0,
    },
    logging: {
      logger: options.logger ?? configFromYaml?.logging?.logger,
    },
    cors: configFromYaml?.cors
      ? {
          origin: (configFromYaml.cors.origin ??
            false) as Configuration["cors"]["origin"],
          methods: configFromYaml.cors.methods ?? [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS",
          ],
          allowedHeaders: configFromYaml.cors?.allowedHeaders,
          exposedHeaders: configFromYaml.cors.exposedHeaders,
          credentials: configFromYaml.cors.credentials,
          maxAge: configFromYaml.cors.maxAge,
        }
      : {
          origin: false,
          methods: [],
        },
  };
  return configuration;
};
