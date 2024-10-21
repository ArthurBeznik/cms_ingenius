import { Course } from "../models/course";
import { getLogger } from "../utils/logger";
import { readJSONFile, writeJSONFile } from "../utils/fileUtils";
import createError from "../utils/error";
import { FILE_PATHS } from "../config/config";

const coursesFilePath = FILE_PATHS.COURSES_FILE_PATH;

const logger = getLogger(__filename);

export const getAllCourses = async (): Promise<Course[]> => {
  const courses: Course[] = await readJSONFile(coursesFilePath);
  if (!courses) {
    throw createError("Could not fetch courses.json", 500);
  }

  logger.info(`Courses (courses.json) fetched successfully`);

  return courses;
};

export const getCourseById = async (courseId: number): Promise<Course> => {
  const courses: Course[] = await getAllCourses();

  const course: Course | undefined = courses.find(
    (course) => course.id === courseId
  );
  if (!course) {
    throw createError(`Course ID [${courseId}] not found`, 404);
  }

  logger.info(`Course ID [${courseId}] fetched successfully`);

  return course;
};

export const addCourse = async (
  newCourseData: Partial<Course>
): Promise<Course> => {
  const { title, description } = newCourseData;
  logger.info(title!, description!);

  const courses: Course[] = await getAllCourses();

  const maxId: number =
    courses.length > 0 ? Math.max(...courses.map((course) => course.id)) : 0;

  const newCourse: Course = {
    id: maxId + 1,
    title: newCourseData.title!,
    description: newCourseData.description!,
    modules: [],
    modulesId: [],
  };

  courses.push(newCourse);
  await writeJSONFile(coursesFilePath, courses);

  logger.info(`Course ID [${newCourse.id}] added successfully`);

  return newCourse;
};

export const updateCourseById = async (
  courseId: number,
  updatedData: Partial<Course>
): Promise<Course> => {
  const courses: Course[] = await getAllCourses();

  const courseIndex: number = courses.findIndex((course) => {
    return course.id === courseId;
  });
  if (courseIndex === -1) {
    throw createError(`Course ID [${courseId}] not found`, 404);
  }

  courses[courseIndex] = { ...courses[courseIndex], ...updatedData };
  await writeJSONFile(coursesFilePath, courses);

  logger.info(`Course ID [${courseId}] updated successfully`);

  return courses[courseIndex];
};

export const deleteCourseById = async (courseId: number): Promise<void> => {
  let courses = await getAllCourses();

  const courseIndex: number = courses.findIndex(
    (course) => course.id === courseId
  );
  if (courseIndex === -1) {
    throw createError(`Course ID [${courseId}] not found`, 404);
  }
  courses = courses.filter((course) => course.id !== courseId);
  await writeJSONFile(coursesFilePath, courses);

  logger.info(`Course ID [${courseId}] deleted successfully`);
};
