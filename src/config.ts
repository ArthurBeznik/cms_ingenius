import path from "path";

export const FILE_PATHS = {
  MODULES_FILE_PATH: path.resolve(__dirname, "../src/data/modules.json"),
  COURSES_FILE_PATH: path.resolve(__dirname, "../src/data/courses.json"),
  LESSONS_FILE_PATH: path.resolve(__dirname, "../src/data/lessons.json"),
};

export const PORT: number = 3000;
export const BASE_URL: string = `http://localhost:${PORT}`;
