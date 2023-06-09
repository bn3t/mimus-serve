import fs from "fs/promises";
import { Stats } from "fs";
import recursive from "recursive-readdir";
import jsonfile from "jsonfile";
import yaml from "js-yaml";
import path, { resolve } from "path";

/**
 * Resolves a file path relative to a parent directory, ensuring that the resulting path is within the parent directory.
 * @param parentDir The parent directory to resolve the path relative to.
 * @param path The path to resolve.
 * @returns The resolved file path.
 * @throws An error if the resolved file path is not within the parent directory.
 */
export const resolvePath = (parentDir: string, path: string): string => {
  const filePath = resolve(parentDir, path);
  if (filePath.indexOf(parentDir) !== 0) {
    throw new Error(`Path ${filePath} is not in ${parentDir}`);
  }
  return filePath;
};

/**
 * Read a file and return its contents as a string or buffer.
 * @param parentDir The parent directory of the file to read.
 * @param path The path of the file to read.
 * @param encoding The encoding to use when reading the file. Defaults to "utf-8".
 * @returns A Promise resolving to the contents of the file.
 */
export const readFile = async (
  parentDir: string,
  path: string,
  encoding: BufferEncoding = "utf-8",
) => {
  const filePath = resolvePath(parentDir, path);
  return await fs.readFile(filePath, { encoding });
};

/**
 * Read a file and return its contents as a buffer.
 * @param parentDir The parent directory of the file to read.
 * @param path The path of the file to read.
 * @returns A Promise resolving to the contents of the file as a buffer.
 */
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

/**
 * Reads and parses a JSON file.
 * @param path The path of the JSON file to read.
 * @returns A Promise resolving to the parsed JSON object.
 */
export const readJsonFile = async (path: string) =>
  await jsonfile.readFile(path);

/**
 * Lists all files in a directory that match the specified patterns.
 * Search is done recursively. The returned file paths are sorted.
 * @see https://www.npmjs.com/package/recursive-readdir
 * @param directory The directory to search for files.
 * @param pattern An array of file extensions to include in the search.
 * @returns A Promise resolving to an array of file paths.
 */
export const listFilesInDir = async (directory: string, pattern: string[]) =>
  (
    await recursive(directory, [
      (file: string, stat: Stats) =>
        !(pattern.includes(path.extname(file)) || stat.isDirectory()),
    ])
  ).sort();
