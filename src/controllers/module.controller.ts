import { Request, Response, NextFunction } from "express";
import * as moduleService from "../services/module.service";
import { Module } from "../models/module";
import { getLogger } from "../utils/logger";
import paginate from "../utils/paginator";

const logger = getLogger(__filename);

export const getAllModules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const courseId: number = parseInt(req.params.courseId);

  if (courseId) {
    logger.info(`Fetching all modules in course ID [${courseId}]`);
  } else {
    logger.info("Fetching all modules");
  }

  try {
    const modules: Module[] = await moduleService.getAllModules(courseId);

    const { page, limit } = req.query;

    const paginatedModules = paginate(modules, page as string, limit as string);

    res.status(200).json(paginatedModules);
  } catch (error) {
    next(error);
  }
};

export const getModule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const courseId: number = parseInt(req.params.courseId);
  const moduleId: number = parseInt(req.params.moduleId);

  if (courseId && moduleId) {
    logger.info(`Fetching module ID [${moduleId}] in course ID [${courseId}]`);
  } else {
    logger.info(`Fetching module ID [${moduleId}]`);
  }

  try {
    const module: Module = await moduleService.getModuleById(
      courseId,
      moduleId
    );
    res.status(200).json(module);
  } catch (error) {
    next(error);
  }
};

export const createModule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const courseId: number = parseInt(req.params.courseId);
  const newModuleData: Partial<Module> = req.body;

  logger.info(`Creating new module for course ID [${courseId}]`);

  try {
    const newModule: Module = await moduleService.addModule(
      newModuleData,
      courseId
    );
    res.status(201).json(newModule);
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const courseId: number = parseInt(req.params.courseId);
  const moduleId: number = parseInt(req.params.moduleId);
  const updatedModuleData: Partial<Module> = req.body;

  if (courseId) {
    logger.info(`Updating module ID [${moduleId}] in course ID [${courseId}]`);
  } else {
    logger.info(`Updating module ID [${moduleId}]`);
  }

  try {
    const updatedModule = await moduleService.updateModuleById(
      moduleId,
      updatedModuleData,
      courseId
    );
    res.status(200).json(updatedModule);
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const courseId: number = parseInt(req.params.courseId);
  const moduleId: number = parseInt(req.params.moduleId);

  if (courseId) {
    logger.info(`Deleting module ID [${moduleId}] in course ID [${courseId}]`);
  } else {
    logger.info(`Deleting module ID [${moduleId}] from modules.json`);
  }

  try {
    await moduleService.deleteModuleById(courseId, moduleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
