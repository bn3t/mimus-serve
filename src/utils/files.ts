import fs from "fs/promises";
import { Stats } from "fs";
import recursive from "recursive-readdir";
import jsonfile from "jsonfile";
import yaml from "js-yaml";
import path, { resolve } from "path";

export const readFile = async (
  parentDir: string,
  path: string,
  encoding: BufferEncoding = "utf-8",
) => {
  const filePath = resolve(parentDir, path);
  if (filePath.indexOf(parentDir) !== 0) {
    throw new Error(`Path ${filePath} is not in ${parentDir}`);
  }
  return await fs.readFile(filePath, { encoding });
};

/**
 * Read and parse a file in the YAML format. The method supports multi document
 * format, This mean it returns an array of objects.
 * @param path Path to the file to read
 * @returns An array of objects
 */
export const readYamlFile = async (path: string): Promise<any[]> => {
  const fileContent = await fs.readFile(path, "utf-8");
  return yaml.loadAll(fileContent);
};

export const readJsonFile = async (path: string) =>
  await jsonfile.readFile(path);

export const listFilesInDir = async (directory: string, pattern: string[]) =>
  (
    await recursive(directory, [
      (file: string, stat: Stats) =>
        !(pattern.includes(path.extname(file)) || stat.isDirectory()),
    ])
  ).sort();
