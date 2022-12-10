import path from "path";
import {
  listFilesInDir,
  readJsonFile,
  readYamlFileMulti,
} from "../utils/files";

export const loadDatasets = async (
  datasetsDir: string,
): Promise<Map<string, any>> => {
  try {
    const files = await listFilesInDir(datasetsDir, [".json", ".yaml", ".yml"]);
    const datasets = await Promise.all(
      files.map(async (file) => {
        let loadedDataset;
        const ext = path.extname(file);
        if (ext === ".json") {
          loadedDataset = await readJsonFile(file);
        } else if (ext === ".yaml" || ext === ".yml") {
          loadedDataset = await readYamlFileMulti(file);
        } else {
          throw new Error(`Unknown file extension: ${file}`);
        }
        const basename = path.basename(file, ext);

        return [basename, loadedDataset];
      }) as Promise<[string, any]>[],
    );
    return new Map<string, any>(datasets);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return new Map<string, any>();
    }
    throw error;
  }
};
