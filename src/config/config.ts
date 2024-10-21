import path from "path";

export const FILE_PATHS = {
  MODULES_FILE_PATH: path.resolve(__dirname, "../data/modules.json"),
  COURSES_FILE_PATH: path.resolve(__dirname, "../data/courses.json"),
  LESSONS_FILE_PATH: path.resolve(__dirname, "../data/lessons.json"),
};

export const PORT: number = 3000;
export const BASE_URL: string = `http://localhost:${PORT}`;
