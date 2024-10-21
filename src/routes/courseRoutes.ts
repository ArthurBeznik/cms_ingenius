import express from "express";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  getCourse,
  deleteCourse,
} from "../controllers/course.controller";
import {
  courseCreateSchema,
  courseUpdateSchema,
} from "../validators/courseSchemas";
import validateRequest from "../middlewares/inputValidator";

const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/courses/:courseId", getCourse);

router.post("/courses", validateRequest(courseCreateSchema), createCourse);

router.put(
  "/courses/:courseId",
  validateRequest(courseUpdateSchema),
  updateCourse
);

router.delete("/courses/:courseId", deleteCourse);

export default router;
