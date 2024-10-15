import express from "express";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  getCourse,
} from "../controllers/courseController";
import { validateCourse } from "../middlewares/courseValidator";

const router = express.Router();

router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourse);

router.post("/courses", createCourse);
// router.post("/courses", validateCourse, createCourse);

router.put("/courses/:id", updateCourse);
// router.put('/courses/:id', validateCourse, updateCourse);

export default router;
