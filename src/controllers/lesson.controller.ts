import { Request, Response, NextFunction } from "express";
import * as lessonService from "../services/lesson.service";
import { Lesson } from "../models/lesson";
import { getLogger } from "../utils/logger";
import paginate from "../utils/paginator";

const logger = getLogger(__filename);

export const getAllLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const moduleId: number = parseInt(req.params.moduleId);
    const courseId: number = parseInt(req.params.courseId);

    const lessons: Lesson[] = await lessonService.getAllLessons(
      moduleId,
      courseId
    );

    const { page, limit } = req.query;

    const paginatedLessons = paginate(lessons, page as string, limit as string);

    res.status(200).json(paginatedLessons);
  } catch (error) {
    next(error);
  }
};

export const getLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const lessonId: number = parseInt(req.params.lessonId);
  const moduleId: number = parseInt(req.params.moduleId);
  const courseId: number = parseInt(req.params.courseId);

  if (courseId && moduleId) {
    logger.info(
      `Fetching lesson ID [${lessonId}] in module ID [${moduleId}] from course ID [${courseId}]`
    );
  } else {
    logger.info(`Fetching lesson ID [${lessonId}]`);
  }

  try {
    const lesson: Lesson = await lessonService.getLessonById(
      lessonId,
      moduleId,
      courseId
    );
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const newLessonData: Partial<Lesson> = req.body;
  const moduleId: number = parseInt(req.params.moduleId);
  const courseId: number = parseInt(req.params.courseId);

  logger.info(
    `Creating new lesson for module ID [${moduleId}] in course ID [${courseId}]`
  );

  try {
    const newLesson: Lesson = await lessonService.addLesson(
      newLessonData,
      moduleId,
      courseId
    );
    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const updatedLessonData: Partial<Lesson> = req.body;
  const lessonId: number = parseInt(req.params.lessonId);
  const moduleId: number = parseInt(req.params.moduleId);
  const courseId: number = parseInt(req.params.courseId);

  logger.info(
    `Updating lesson ID [${lessonId}] for module ID [${moduleId}] in course ID [${courseId}]`
  );

  try {
    const updatedLesson = await lessonService.updateLessonById(
      updatedLessonData,
      lessonId,
      moduleId,
      courseId
    );
    res.status(200).json(updatedLesson);
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const courseId: number = parseInt(req.params.courseId);
  const moduleId: number = parseInt(req.params.moduleId);
  const lessonId: number = parseInt(req.params.lessonId);

  logger.info(
    `Deleting lesson ID [${lessonId}] for module ID [${moduleId}] in course ID [${courseId}]`
  );

  try {
    await lessonService.deleteLessonById(lessonId, courseId, moduleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
