import { Request, Response, NextFunction } from "express";
import { Course } from "../models/course";
import * as courseService from "../services/course.service";
import { getLogger } from "../utils/logger";
import paginate from "../utils/paginator";

const logger = getLogger(__filename);

export const getCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const courseId: number = parseInt(req.params.courseId);

  logger.info(`Fetching course ID [${courseId}]`);

  try {
    const course: Course = await courseService.getCourseById(courseId);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses: Course[] = await courseService.getAllCourses();
    const { page, limit } = req.query;

    const paginatedCourses = paginate(courses, page as string, limit as string);

    res.status(200).json(paginatedCourses);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Creating new course");

  const newCourseData: Partial<Course> = req.body;

  try {
    const newCourse: Course = await courseService.addCourse(newCourseData);
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const courseId: number = parseInt(req.params.courseId);
  const updatedCourseData: Partial<Course> = req.body;

  logger.info(`Updating course ID [${courseId}]`);

  try {
    const course = await courseService.updateCourseById(
      courseId,
      updatedCourseData
    );
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const courseId: number = parseInt(req.params.courseId);

  logger.info(`Deleting course ID [${courseId}]`);

  try {
    await courseService.deleteCourseById(courseId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
