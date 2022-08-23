import fs from "fs/promises";

export const readFile = async (
  path: string,
  encoding: BufferEncoding = "utf-8",
) => await fs.readFile(path, { encoding });
