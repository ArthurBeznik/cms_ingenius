import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { CustomError } from "../models/error";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error: ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || "An unexpected error occurred",
  });
};

export default errorHandler;
