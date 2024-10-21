import Joi from "joi";

export const courseCreateSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
});

export const courseUpdateSchema = Joi.object({
  title: Joi.string().min(5).max(100).optional(),
  description: Joi.string().min(10).max(500).optional(),
});
