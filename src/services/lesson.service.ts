import { Lesson } from "../models/lesson";
import { getLogger } from "../utils/logger";
import { readJSONFile, writeJSONFile } from "../utils/fileUtils";
import { Course } from "../models/course";
import {
  getCourseById,
  getAllCourses,
  updateCourseById,
} from "../services/course.service";
import {
  getAllModules,
  getModuleById,
  updateModuleById,
} from "../services/module.service";
import { Module } from "../models/module";
import createError from "../utils/error";
import { FILE_PATHS } from "../config";

const modulesFilePath = FILE_PATHS.MODULES_FILE_PATH;
const coursesFilePath = FILE_PATHS.COURSES_FILE_PATH;
const lessonsFilePath = FILE_PATHS.LESSONS_FILE_PATH;

const logger = getLogger(__filename);

export const getAllLessons = async (
  moduleId?: number,
  courseId?: number
): Promise<Lesson[]> => {
  if (moduleId && courseId) {
    const module: Module = await getModuleById(courseId, moduleId);
    return module.lessons;
  }
  const lessons: Lesson[] = await readJSONFile(lessonsFilePath);
  if (!lessons) {
    throw createError("Could not fetch lessons.json", 500);
  }

  logger.info(`Lessons (lessons.json) fetched successfully`);
  return lessons;
};

export const getLessonById = async (
  lessonId: number,
  moduleId?: number,
  courseId?: number
): Promise<Lesson> => {
  const lessons: Lesson[] = await getAllLessons(moduleId, courseId);
  const lesson: Lesson | undefined = lessons.find(
    (lesson) => lesson.id === lessonId
  );

  if (!lesson) {
    throw createError(`Lesson ID [${lessonId}] not found`, 404);
  }

  logger.info(`Lesson ID [${lessonId}] fetched successfully`);
  return lesson;
};

export const addLesson = async (
  newLessonData: Partial<Lesson>,
  courseId: number,
  moduleId: number
): Promise<Lesson> => {
  const course = await getCourseById(courseId);

  const module = course.modules.find((module) => module.id === moduleId);
  if (!module) {
    throw createError(
      `Module ID [${moduleId}] not found in course ID [${courseId}]`,
      404
    );
  }

  const lessons: Lesson[] = await getAllLessons();
  const newLessonId =
    lessons.length > 0
      ? Math.max(...lessons.map((lesson) => lesson.id)) + 1
      : 1;

  const newLesson: Lesson = {
    id: newLessonId,
    title: newLessonData.title!,
    description: newLessonData.description!,
    content: newLessonData.content!,
    topics: newLessonData.topics!,
    moduleId: moduleId,
  };

  lessons.push(newLesson);
  await writeJSONFile(lessonsFilePath, lessons);

  module.lessons.push(newLesson);
  module.lessonsId.push(newLesson.id);

  await updateModuleById(moduleId, module, courseId);

  logger.info(
    `Lesson ID [${newLesson.id}] created successfully in module ID [${moduleId}] of course ID [${courseId}]`
  );

  return newLesson;
};

export const updateLessonById = async (
  updatedData: Partial<Lesson>,
  lessonId: number,
  courseId: number,
  moduleId: number
): Promise<Lesson> => {
  const course = await getCourseById(courseId);

  const module = course.modules.find((m) => m.id === moduleId);
  if (!module) {
    throw createError(
      `Module ID [${moduleId}] not found in course ID [${courseId}]`,
      404
    );
  }

  const lessons: Lesson[] = await getAllLessons();
  const lessonIndex: number = lessons.findIndex(
    (lesson) => lesson.id === lessonId
  );

  if (lessonIndex === -1) {
    throw createError(`Lesson ID [${lessonId}] not found`, 404);
  }

  const updatedLesson: Lesson = { ...lessons[lessonIndex], ...updatedData };
  lessons[lessonIndex] = updatedLesson;

  await writeJSONFile(lessonsFilePath, lessons);

  const moduleLessonIndex = module.lessons.findIndex(
    (lesson) => lesson.id === lessonId
  );
  if (moduleLessonIndex !== -1) {
    module.lessons[moduleLessonIndex] = updatedLesson;
  }

  const moduleLessonIdIndex = module.lessonsId.findIndex(
    (id) => id === lessonId
  );
  if (moduleLessonIdIndex !== -1) {
    module.lessonsId[moduleLessonIdIndex] = updatedLesson.id;
  }

  await updateModuleById(moduleId, module, courseId);

  logger.info(
    `Lesson ID [${lessonId}] updated successfully in module ID [${moduleId}] of course ID [${courseId}]`
  );

  return updatedLesson;
};

export const deleteLessonById = async (
  lessonId: number,
  courseId: number,
  moduleId: number
): Promise<void> => {
  const course = await getCourseById(courseId);

  const module = course.modules.find((m) => m.id === moduleId);
  if (!module) {
    throw createError(
      `Module ID [${moduleId}] not found in course ID [${courseId}]`,
      404
    );
  }

  const lessonIndex = module.lessons.findIndex(
    (lesson) => lesson.id === lessonId
  );
  if (lessonIndex === -1) {
    throw createError(`Lesson ID [${lessonId}] not found`, 404);
  }

  module.lessons.splice(lessonIndex, 1);
  module.lessonsId = module.lessonsId.filter((id) => id !== lessonId);

  const lessons: Lesson[] = await getAllLessons();
  const updatedLessons = lessons.filter((lesson) => lesson.id !== lessonId);
  await writeJSONFile(lessonsFilePath, updatedLessons);

  await updateModuleById(moduleId, module, courseId);

  logger.info(
    `Lesson ID [${lessonId}] deleted successfully from module ID [${moduleId}] of course ID [${courseId}]`
  );
};
