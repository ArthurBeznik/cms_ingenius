
import { Request, Response, NextFunction } from "express";
import { courseSchema } from "../models/course";
import { logger } from "../utils/logger";

export const validateCourse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = courseSchema.validate(req.body);
  if (error) {
    next(error);
  }

  next();
};
