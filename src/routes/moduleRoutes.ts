import express from "express";
import {
  getAllModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
} from "../controllers/module.controller";
import {
  moduleCreateSchema,
  moduleUpdateSchema,
} from "../validators/moduleSchemas";
import validateRequest from "../middlewares/inputValidator";

const baseUrl: string = "/courses/:courseId/modules";
const router = express.Router();

router.get("/modules", getAllModules);
router.get(baseUrl, getAllModules);
router.get(`${baseUrl}/:moduleId`, getModule);
router.get("/modules/:moduleId", getModule);

router.post(baseUrl, validateRequest(moduleCreateSchema), createModule);

router.put(
  `${baseUrl}/:moduleId`,
  validateRequest(moduleUpdateSchema),
  updateModule
);

router.delete(`${baseUrl}/:moduleId`, deleteModule);

export default router;
