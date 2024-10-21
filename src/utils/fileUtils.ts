import { promises as fs } from "fs";
import createError from "./error";

export const readJSONFile = async (path: string) => {
  try {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw createError(`Reading from JSON file at [${path}]`, 500);
  }
};

export const writeJSONFile = async (path: string, data: any) => {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    throw createError(`Writing to JSON file at [${path}]`, 500);
  }
};
