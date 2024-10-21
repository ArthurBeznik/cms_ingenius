import { Request, Response, NextFunction } from "express";
import createError from "../utils/error";

const unknownRoute = (req: Request, res: Response, next: NextFunction) => {
  const errorMessage = `Route [${req.originalUrl}] not found`;
  next(createError(errorMessage, 404));
};

export default unknownRoute;
