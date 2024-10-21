import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import createError from "../utils/error";

const validateRequest = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.validate(req.body);
    if (result.error) {
      throw createError(result.error.message, 400);
    }
    req.body = result.value;
    next();
  };
};

export default validateRequest;
