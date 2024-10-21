import { Module } from "../models/module";
import { getLogger } from "../utils/logger";
import { readJSONFile, writeJSONFile } from "../utils/fileUtils";
import { Course } from "../models/course";
import { getCourseById, updateCourseById } from "./course.service";
import createError from "../utils/error";
import { FILE_PATHS } from "../config/config";

const modulesFilePath = FILE_PATHS.MODULES_FILE_PATH;
const coursesFilePath = FILE_PATHS.COURSES_FILE_PATH;

const logger = getLogger(__filename);

export const getAllModules = async (courseId?: number): Promise<Module[]> => {
  if (courseId) {
    const course: Course = await getCourseById(courseId);
    return course.modules;
  }

  const modules: Module[] = await readJSONFile(modulesFilePath);
  if (!modules) {
    throw createError("Could not fetch modules.json", 500);
  }

  logger.info(`Modules (modules.json) fetched successfully`);

  return modules;
};

export const getModuleById = async (
  courseId: number,
  moduleId: number
): Promise<Module> => {
  const modules: Module[] = await getAllModules(courseId);

  const module: Module | undefined = modules.find(
    (module) => module.id === moduleId
  );
  if (!module) {
    throw createError(`Module ID [${moduleId}] not found`, 404);
  }

  logger.info(`Module ID [${moduleId}] fetched successfully`);

  return module;
};

export const addModule = async (
  newModuleData: Partial<Module>,
  courseId: number
): Promise<Module> => {
  const modules: Module[] = await getAllModules();

  const maxId: number =
    modules.length > 0 ? Math.max(...modules.map((module) => module.id)) : 0;

  const newModule: Module = {
    id: maxId + 1,
    title: newModuleData.title!,
    lessons: [],
    lessonsId: [],
    courseId: courseId,
  };

  const course: Course = await getCourseById(courseId);

  course.modules.push(newModule);
  course.modulesId.push(newModule.id);

  const courses: Course[] = await readJSONFile(coursesFilePath);
  const courseIndex = courses.findIndex((c) => c.id === courseId);

  courses[courseIndex] = course;

  await writeJSONFile(coursesFilePath, courses);

  modules.push(newModule);
  await writeJSONFile(modulesFilePath, modules);

  logger.info(
    `Module ID [${newModule.id}] created successfully in course ID [${courseId}] and globally`
  );

  return newModule;
};

export const updateModuleById = async (
  moduleId: number,
  updatedData: Partial<Module>,
  courseId: number
): Promise<Module> => {
  const course: Course = await getCourseById(courseId);

  const moduleInCourseIndex = course.modules.findIndex(
    (module) => module.id === moduleId
  );

  if (moduleInCourseIndex === -1) {
    throw createError(
      `Module ID [${moduleId}] not found in course ID [${courseId}]`,
      404
    );
  }

  const updatedModule: Module = {
    ...course.modules[moduleInCourseIndex],
    ...updatedData,
  };

  course.modules[moduleInCourseIndex] = updatedModule;

  await updateCourseById(courseId, course);

  const modulesFromFile: Module[] = await getAllModules();
  const moduleIndex: number = modulesFromFile.findIndex(
    (module) => module.id === moduleId
  );

  if (moduleIndex === -1) {
    throw createError(
      `Module ID [${moduleId}] not found in global modules`,
      404
    );
  }

  modulesFromFile[moduleIndex] = updatedModule;

  await writeJSONFile(modulesFilePath, modulesFromFile);

  logger.info(
    `Module ID [${moduleId}] updated successfully in course ID [${courseId}] and globally`
  );

  return updatedModule;
};

export const deleteModuleById = async (
  courseId: number,
  moduleId: number
): Promise<void> => {
  const course: Course = await getCourseById(courseId);

  const moduleInCourseIndex = course.modules.findIndex(
    (mod) => mod.id === moduleId
  );

  if (moduleInCourseIndex === -1) {
    throw createError(
      `Module ID [${moduleId}] not found in course ID [${courseId}]`,
      404
    );
  }

  course.modules.splice(moduleInCourseIndex, 1);
  course.modulesId = course.modulesId.filter((id) => id !== moduleId);

  await updateCourseById(courseId, course);

  let modules: Module[] = await getAllModules();
  const updatedModules = modules.filter((module) => module.id !== moduleId);

  await writeJSONFile(modulesFilePath, updatedModules);

  logger.info(
    `Module ID [${moduleId}] deleted successfully from course ID [${courseId}] and globally`
  );
};
