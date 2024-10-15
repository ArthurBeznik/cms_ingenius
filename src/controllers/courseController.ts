
import { Request, Response, NextFunction } from "express";
import { getCourses, addCourse, getCourseById, updateCourseById } from "../services/courseService";
import { readJSONFile, writeJSONFile } from "../utils/fileUtils";
import { Course } from "../models/course";
import { logger } from "../utils/logger";

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  const courseId: number = parseInt(req.params.id);
  logger.info("getCourse endpoint, id: " + courseId); //? debug

  try {
    const course: Course = await getCourseById(courseId);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('getAllCourses endpoint'); //? debug

  try {
    const courses: Course[] = await getCourses();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("createCourse endpoint"); //? debug

  try {
    const newCourse = req.body;
    await addCourse(newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  const courseId: number = parseInt(req.params.id);
  const updatedCourseData = req.body;

  logger.info("updateCourse endpoint, id: " + courseId); //? debug

  try {
    const course = await updateCourseById(courseId, updatedCourseData);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};
