import { Module } from "../../models/module";
import * as moduleService from "../../services/module.service";
import createError from "../../utils/error";
import { writeJSONFile, readJSONFile } from "../../utils/fileUtils";
import fs from "fs";
import path from "path";
import { Course } from "../../models/course";
import { FILE_PATHS } from "../../config/config";
import { Lesson } from "../../models/lesson";
import {
  testCourse1,
  testCourse2,
  testModule1,
  testModule2,
  testLesson1,
  testLesson2,
  testLesson3,
  testLesson4,
} from "../testData";
import { server } from "../../app";

const lessonsFilePath = FILE_PATHS.LESSONS_FILE_PATH;
const modulesFilePath = FILE_PATHS.MODULES_FILE_PATH;
const coursesFilePath = FILE_PATHS.COURSES_FILE_PATH;

jest.mock("../../utils/error", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }),
}));

beforeAll(() => {
  process.env.PORT = `${Math.floor(Math.random() * 1000) + 3000}`;
  console.log(`Setting server on port ${process.env.PORT}`);
});

describe("Module Service Integration Tests", () => {
  beforeEach(async () => {
    await writeJSONFile(coursesFilePath, [testCourse1, testCourse2]);
    await writeJSONFile(modulesFilePath, [testModule1, testModule2]);
    await writeJSONFile(lessonsFilePath, [
      testLesson1,
      testLesson2,
      testLesson3,
      testLesson4,
    ]);
  });

  afterAll(() => {
    if (server) {
      console.log(`Closing server on port ${process.env.PORT}`);
      server.close();
    }
  });

  describe("getAllModules", () => {
    it("should return all modules for a course", async () => {
      const modules = await moduleService.getAllModules(testCourse1.id);
      expect(modules).toHaveLength(1);
      expect(modules[0].title).toBe("Module 1");
    });

    it("should throw an error if no modules are found for the course", async () => {
      const nonExistentCourseId = 999;
      await expect(
        moduleService.getAllModules(nonExistentCourseId)
      ).rejects.toThrow("Course ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Course ID [999] not found",
        404
      );
    });
  });

  describe("getModuleById", () => {
    it("should fetch a module by ID", async () => {
      const module = await moduleService.getModuleById(
        testCourse1.id,
        testModule1.id
      );
      expect(module).toBeDefined();
      expect(module?.title).toBe("Module 1");
    });

    it("should throw an error if the module is not found", async () => {
      const nonExistentModuleId = 999;
      await expect(
        moduleService.getModuleById(testCourse1.id, nonExistentModuleId)
      ).rejects.toThrow("Module ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found",
        404
      );
    });
  });

  describe("addModule", () => {
    it("should add a new module successfully", async () => {
      const newModuleData: Partial<Module> = {
        title: "New Module",
      };

      const addedModule = await moduleService.addModule(
        newModuleData,
        testCourse1.id
      );

      expect(addedModule).toEqual(expect.objectContaining(newModuleData));

      const modules = await moduleService.getAllModules(testCourse1.id);
      expect(modules).toHaveLength(2);
      expect(modules[1].title).toBe("New Module");
    });
  });

  describe("updateModuleById", () => {
    it("should update a module successfully", async () => {
      const updatedData: Partial<Module> = {
        title: "Updated Module",
      };

      const updatedModule = await moduleService.updateModuleById(
        testModule1.id,
        updatedData,
        testCourse1.id
      );
      expect(updatedModule?.title).toBe("Updated Module");

      const module = await moduleService.getModuleById(
        testCourse1.id,
        testModule1.id
      );
      expect(module?.title).toBe("Updated Module");
    });

    it("should throw an error if the module to update is not found", async () => {
      const nonExistentModuleId = 999;
      const updatedModuleData: Partial<Module> = {
        title: "Updated Module",
      };

      await expect(
        moduleService.updateModuleById(
          nonExistentModuleId,
          updatedModuleData,
          testCourse1.id
        )
      ).rejects.toThrow("Module ID [999] not found in course ID [1]");
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found in course ID [1]",
        404
      );
    });
  });

  describe("deleteModuleById", () => {
    it("should delete a module successfully", async () => {
      await moduleService.deleteModuleById(testCourse1.id, testModule1.id);

      const modules = await moduleService.getAllModules(testCourse1.id);
      expect(modules).toHaveLength(0);
    });

    it("should throw an error if the module to delete is not found", async () => {
      const nonExistentModuleId = 999;

      await expect(
        moduleService.deleteModuleById(testCourse1.id, nonExistentModuleId)
      ).rejects.toThrow("Module ID [999] not found in course ID [1]");
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found in course ID [1]",
        404
      );
    });
  });
});
