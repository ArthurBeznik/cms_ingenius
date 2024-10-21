import Joi from "joi";

export const lessonCreateSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  topics: Joi.array().items(Joi.string()).required(),
  content: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid("text", "video", "audio").required(),
        data: Joi.string().required(),
      })
    )
    .required(),
});

export const lessonUpdateSchema = Joi.object({
  title: Joi.string().min(5).max(100).optional(),
  description: Joi.string().min(10).max(500).optional(),
  topics: Joi.array().items(Joi.string()).optional(),
  content: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid("text", "video", "audio").required(),
        data: Joi.string().required(),
      })
    )
    .optional(),
});
