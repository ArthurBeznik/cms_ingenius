import { Module } from "../../models/module";
import * as moduleService from "../../services/module.service";
import createError from "../../utils/error";
import { writeJSONFile, readJSONFile } from "../../utils/fileUtils";
import fs from "fs";
import path from "path";
import { Course } from "../../models/course";
import { FILE_PATHS } from "../../config/config";
import { Lesson } from "../../models/lesson";

const lessonsFilePath = FILE_PATHS.LESSONS_FILE_PATH;
const modulesFilePath = FILE_PATHS.MODULES_FILE_PATH;
const coursesFilePath = FILE_PATHS.COURSES_FILE_PATH;

const testLesson1: Lesson = {
  id: 1,
  title: "Lesson 1",
  description: "Lesson for testing",
  content: [],
  topics: ["Topic 1"],
  moduleId: 1,
};

const testLesson2: Lesson = {
  id: 2,
  title: "Lesson 2",
  description: "Lesson 2 for testing",
  content: [],
  topics: ["Topic 2"],
  moduleId: 1,
};

const testLesson3: Lesson = {
  id: 3,
  title: "Lesson 3",
  description: "Lesson 3 for testing",
  content: [],
  topics: ["Topic 1"],
  moduleId: 2,
};

const testLesson4: Lesson = {
  id: 4,
  title: "Lesson 4",
  description: "Lesson 4 for testing",
  content: [],
  topics: ["Topic 2"],
  moduleId: 2,
};

const testModule1: Module = {
  id: 1,
  title: "Module 1",
  lessons: [testLesson1, testLesson2],
  lessonsId: [testLesson1.id, testLesson2.id],
  courseId: 1,
};

const testModule2: Module = {
  id: 2,
  title: "Module 2",
  lessons: [testLesson3, testLesson4],
  lessonsId: [testLesson3.id, testLesson4.id],
  courseId: 2,
};

const testCourse1: Course = {
  id: 1,
  title: "Test Course 1",
  description: "Course 1 for testing",
  modules: [testModule1],
  modulesId: [testModule1.id],
};

const testCourse2: Course = {
  id: 2,
  title: "Test Course 2",
  description: "Course 2 for testing",
  modules: [testModule2],
  modulesId: [testModule2.id],
};

// Mock error creation
jest.mock("../../utils/error", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }),
}));

describe("Module Service Integration Tests", () => {
  beforeEach(async () => {
    // Initialize the courses, modules, and lessons JSON files with predefined data
    await writeJSONFile(coursesFilePath, [testCourse1, testCourse2]);
    await writeJSONFile(modulesFilePath, [testModule1, testModule2]);
    await writeJSONFile(lessonsFilePath, [
      testLesson1,
      testLesson2,
      testLesson3,
      testLesson4,
    ]);
  });

  afterEach(() => {
    // Optionally clean up the files after each test if needed
    // fs.unlinkSync(modulesFilePath);
    // fs.unlinkSync(coursesFilePath);
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

      // Verifying the added module
      expect(addedModule).toEqual(expect.objectContaining(newModuleData));

      // Verify the module exists when fetching all modules for the course
      const modules = await moduleService.getAllModules(testCourse1.id);
      expect(modules).toHaveLength(2); // Now should include 2 modules
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

      // Verify the module is updated when fetching by ID
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

      // Verify the module no longer exists in the course
      const modules = await moduleService.getAllModules(testCourse1.id);
      expect(modules).toHaveLength(0); // After deletion, no modules should remain
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
