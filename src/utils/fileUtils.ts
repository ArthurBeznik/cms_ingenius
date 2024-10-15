import { promises as fs } from "fs";

const readJSONFile = async (path: string) => {
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data);
};

const writeJSONFile = async (path: string, data: any) => {
  await fs.writeFile(path, JSON.stringify(data, null, 2), "utf-8");
};

export { readJSONFile, writeJSONFile };
