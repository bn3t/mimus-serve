import fs from "fs/promises";
import recursive from "recursive-readdir";
import jsonfile from "jsonfile";
import path from "path";

export const readFile = async (
  path: string,
  encoding: BufferEncoding = "utf-8",
) => await fs.readFile(path, { encoding });

export const readJsonFile = async (path: string) =>
  await jsonfile.readFile(path);

export const listFilesInDir = async (directory: string, pattern: string[]) =>
  (
    await recursive(directory, [
      (file: string) => !pattern.includes(path.extname(file)),
    ])
  ).sort();
