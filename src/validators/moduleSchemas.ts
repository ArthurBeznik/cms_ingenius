import Joi from "joi";

export const moduleCreateSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
});

export const moduleUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
});
