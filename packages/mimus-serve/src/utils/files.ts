import fs from "fs/promises";
import { Stats } from "fs";
import recursive from "recursive-readdir";
import jsonfile from "jsonfile";
import yaml from "js-yaml";
import path, { resolve } from "path";

export const resolvePath = (parentDir: string, path: string): string => {
  const filePath = resolve(parentDir, path);
  if (filePath.indexOf(parentDir) !== 0) {
    throw new Error(`Path ${filePath} is not in ${parentDir}`);
  }
  return filePath;
};

export const readFile = async (
  parentDir: string,
  path: string,
  encoding: BufferEncoding = "utf-8",
) => {
  const filePath = resolvePath(parentDir, path);
  return await fs.readFile(filePath, { encoding });
};

export const readFileBinary = async (parentDir: string, path: string) => {
  const filePath = resolvePath(parentDir, path);
  return await fs.readFile(filePath, { encoding: null });
};

/**
 * Read and parse a file in the YAML format. The method supports multi document
 * format, This mean it returns an array of objects.
 * @param path Path to the file to read
 * @returns A Promise resolving to an array of objects
 */
export const readYamlFileMulti = async <T>(path: string): Promise<T[]> => {
  const fileContent = await fs.readFile(path, "utf-8");
  return yaml.loadAll(fileContent) as T[];
};

/**
 * Read and parse a file in the YAML format.
 * @param path Path to the file to read
 * @returns One Promise resolving to an object
 */
export const readYamlFile = async <T>(path: string): Promise<T> => {
  const fileContent = await fs.readFile(path, "utf-8");
  return yaml.load(fileContent) as T;
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
