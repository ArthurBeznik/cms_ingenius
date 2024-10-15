import { promises as fs } from "fs";
import path from "path";
import { Course } from "../models/course";
import { getLogger } from "../utils/logger";
import { readJSONFile, writeJSONFile } from "../utils/fileUtils";
import { createError } from "../utils/error";

const coursesFilePath = path.join(__dirname, "../data/courses.json");

const logger = getLogger(__filename);

export const getCourseById = async (courseId: number): Promise<Course> => {
  logger.info("getCourseById id: " + courseId); //? debug

  const courses: Course[] = await readJSONFile(coursesFilePath);
  if (!courses) {
    throw createError("Could not fetch courses.json", 500);
  }

  const course: Course | undefined = courses.find(
    (course) => course.id === courseId
  );
  if (!course) {
    throw createError("Could not find course with ID: " + courseId, 404);
  }

  return course;
};

export const getCourses = async (): Promise<Course[]> => {
  logger.info("getCourses"); //? debug

  const courses: Course[] = await readJSONFile(coursesFilePath);
  if (!courses) {
    throw createError("Could not fetch courses.json", 500);
  }
  return courses;
};

export const addCourse = async (newCourse: Course): Promise<void> => {
  logger.info("addCourse course:" + newCourse); //? debug

  const courses: Course[] = await getCourses();
  if (!courses) {
    throw createError("Could not fetch courses.json", 500);
  }

  const courseIndex: number = courses.findIndex((course) => {
    return course.id === newCourse.id;
  });

  if (courseIndex !== -1) {
    throw createError(`Course with ID ${newCourse.id} already exists`, 505);
  } else {
    courses.push(newCourse);
    await writeJSONFile(coursesFilePath, courses);
  }
};

export const updateCourseById = async (
  courseId: number,
  data: any
): Promise<Course> => {
  logger.info("updateCourseById id: " + courseId); //? debug
  logger.info("data: " + JSON.stringify(data)); //? debug

  const courses: Course[] = await getCourses();

  const courseIndex: number = courses.findIndex((course) => {
    return course.id === courseId;
  });

  if (courseIndex === -1) {
    throw createError(`Course with ID ${courseId} not found`, 404);
  }

  courses[courseIndex] = { ...courses[courseIndex], ...data };

  await writeJSONFile(coursesFilePath, courses);

  return courses[courseIndex];
};
