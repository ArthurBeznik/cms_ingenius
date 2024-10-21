import express from "express";
import {
  getAllLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lesson.controller";
import {
  lessonCreateSchema,
  lessonUpdateSchema,
} from "../validators/lessonSchemas";
import validateRequest from "../middlewares/inputValidator";

const baseUrl: string = "/courses/:courseId/modules/:moduleId/lessons";
const router = express.Router();

router.get("/lessons/:lessonId", getLesson);
router.get("/lessons", getAllLessons);
router.get(`${baseUrl}/:lessonId`, getLesson);
router.get(baseUrl, getAllLessons);

router.post(baseUrl, validateRequest(lessonCreateSchema), createLesson);

router.put(
  `${baseUrl}/:lessonId`,
  validateRequest(lessonUpdateSchema),
  updateLesson
);

router.delete(`${baseUrl}/:lessonId`, deleteLesson);

export default router;
