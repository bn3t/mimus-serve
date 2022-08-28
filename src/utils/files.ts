import fs from "fs/promises";
import { Stats } from "fs";
import recursive from "recursive-readdir";
import jsonfile from "jsonfile";
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

export const readJsonFile = async (path: string) =>
  await jsonfile.readFile(path);

export const listFilesInDir = async (directory: string, pattern: string[]) =>
  (
    await recursive(directory, [
      (file: string, stat: Stats) =>
        !(pattern.includes(path.extname(file)) || stat.isDirectory()),
    ])
  ).sort();
