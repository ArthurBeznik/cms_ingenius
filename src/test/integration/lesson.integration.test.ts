import { Lesson } from "../../models/lesson";
import * as lessonService from "../../services/lesson.service";
import * as moduleService from "../../services/module.service";
import * as courseService from "../../services/course.service";
import createError from "../../utils/error";
import { writeJSONFile, readJSONFile } from "../../utils/fileUtils";
import fs from "fs";
import path from "path";
import { Course } from "../../models/course";
import { Module } from "../../models/module";
import { FILE_PATHS } from "../../config/config";

const lessonsFilePath = FILE_PATHS.LESSONS_FILE_PATH;
const coursesFilePath = FILE_PATHS.COURSES_FILE_PATH;
const modulesFilePath = FILE_PATHS.MODULES_FILE_PATH;

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
  description: "Lesson 3for testing",
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

jest.mock("../../utils/error", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }),
}));

describe("Lesson Service Integration Tests", () => {
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
    // Optionally clean up the files after each test
    // fs.unlinkSync(lessonsFilePath);
    // fs.unlinkSync(modulesFilePath);
    // fs.unlinkSync(coursesFilePath);
  });

  describe("getAllLessons", () => {
    it("should return all lessons for a course and module", async () => {
      const lessons = await lessonService.getAllLessons(
        testModule1.id,
        testCourse1.id
      );
      expect(lessons).toHaveLength(2);
      expect(lessons[0].title).toBe("Lesson 1");
    });

    it("should return all lessons when no specific module or course is provided", async () => {
      const lessons = await lessonService.getAllLessons();
      expect(lessons).toHaveLength(4);
      expect(lessons[0].title).toBe("Lesson 1");
      expect(lessons[1].title).toBe("Lesson 2");
    });

    it("should throw an error if lessons are not found", async () => {
      const nonExistentModuleId = 999;
      await expect(
        lessonService.getAllLessons(nonExistentModuleId, testCourse1.id)
      ).rejects.toThrow("Module ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found",
        404
      );
    });
  });

  describe("getLessonById", () => {
    it("should return the correct lesson by ID", async () => {
      const lesson = await lessonService.getLessonById(
        testLesson1.id,
        testModule1.id,
        testCourse1.id
      );
      expect(lesson.title).toBe("Lesson 1");
    });

    it("should throw an error if the lesson is not found", async () => {
      const nonExistentLessonId = 999;
      await expect(
        lessonService.getLessonById(
          nonExistentLessonId,
          testModule1.id,
          testCourse1.id
        )
      ).rejects.toThrow("Lesson ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Lesson ID [999] not found",
        404
      );
    });
  });

  describe("addLesson", () => {
    it("should add a new lesson successfully", async () => {
      const newLessonData: Partial<Lesson> = {
        title: "New Lesson",
        description: "New lesson description",
        content: [],
        topics: ["New topic"],
      };

      const addedLesson = await lessonService.addLesson(
        newLessonData,
        testCourse1.id,
        testModule1.id
      );
      expect(addedLesson.title).toBe("New Lesson");

      // Verify the lesson exists when fetching all lessons for the module
      const lessons = await lessonService.getAllLessons(
        testModule1.id,
        testCourse1.id
      );
      expect(lessons).toHaveLength(3);
      expect(lessons[2].title).toBe("New Lesson");
    });

    //TODO missing input validator
    // it("should throw an error if required fields are missing", async () => {
    //   const newLessonData: Partial<Lesson> = {}; // Missing required fields

    //   await expect(
    //     lessonService.addLesson(newLessonData, testCourseId, testModuleId1)
    //   ).rejects.toThrow('"title" is required');
    // });
  });

  describe("updateLessonById", () => {
    it("should update a lesson successfully", async () => {
      const updatedData: Partial<Lesson> = {
        title: "Updated Lesson",
        description: "Updated description",
      };

      const updatedLesson = await lessonService.updateLessonById(
        updatedData,
        testLesson1.id,
        testCourse1.id,
        testModule1.id
      );
      expect(updatedLesson.title).toBe("Updated Lesson");

      // Verify the lesson is updated when fetching by ID
      const lesson = await lessonService.getLessonById(
        testLesson1.id,
        testModule1.id,
        testCourse1.id
      );
      expect(lesson.title).toBe("Updated Lesson");
    });

    it("should throw an error if the lesson to update is not found", async () => {
      const nonExistentLessonId = 999;
      const updatedLessonData: Partial<Lesson> = {
        title: "Updated Lesson",
      };

      await expect(
        lessonService.updateLessonById(
          updatedLessonData,
          nonExistentLessonId,
          testCourse1.id,
          testModule1.id
        )
      ).rejects.toThrow("Lesson ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Lesson ID [999] not found",
        404
      );
    });
  });

  describe("deleteLessonById", () => {
    it("should delete a lesson successfully", async () => {
      await lessonService.deleteLessonById(
        testLesson1.id,
        testCourse1.id,
        testModule1.id
      );

      // Verify the lesson no longer exists in the module
      const lessons = await lessonService.getAllLessons(
        testModule1.id,
        testCourse1.id
      );
      expect(lessons).toHaveLength(1);
    });

    it("should throw an error if the lesson to delete is not found", async () => {
      const nonExistentLessonId = 999;

      await expect(
        lessonService.deleteLessonById(
          nonExistentLessonId,
          testCourse1.id,
          testModule1.id
        )
      ).rejects.toThrow("Lesson ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Lesson ID [999] not found",
        404
      );
    });
  });
});
