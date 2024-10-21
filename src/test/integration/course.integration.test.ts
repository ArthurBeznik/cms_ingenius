import { FILE_PATHS } from "../../config";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";
import { Module } from "../../models/module";
import * as courseService from "../../services/course.service";
import createError from "../../utils/error";
import { readJSONFile, writeJSONFile } from "../../utils/fileUtils"; // Assuming these are the file functions you use
import fs from "fs";
import path from "path";

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

describe("Course Service Integration Tests", () => {
  beforeAll(async () => {
    // Create a fresh file or in-memory DB setup before running the tests
    await writeJSONFile(coursesFilePath, [testCourse1, testCourse2]);
  });

  afterAll(() => {
    // Clean up after all tests are done, like removing temp files
    // if (fs.existsSync(testFilePath)) {
    //   fs.unlinkSync(testFilePath);
    // }
  });

  describe("getAllCourses", () => {
    it("should return an empty array when no courses exist", async () => {
      const courses = await courseService.getAllCourses();
      expect(courses.length).toEqual(2); // Expect no courses initially
    });
  });

  describe("addCourse", () => {
    it("should add a course successfully", async () => {
      const newCourse: Partial<Course> = {
        title: "Test Course",
        description: "This is a test course",
        modules: [],
        modulesId: [],
      };

      const addedCourse = await courseService.addCourse(newCourse);

      // Verify the newly added course
      expect(addedCourse).toEqual(expect.objectContaining(newCourse));

      // Verify the course exists when fetching all courses
      const allCourses = await courseService.getAllCourses();
      expect(allCourses.length).toEqual(3);
      expect(allCourses[2].title).toBe("Test Course");
    });
  });

  describe("getCourseById", () => {
    it("should fetch a course by ID", async () => {
      const courseId = 1;
      const course = await courseService.getCourseById(courseId);
      expect(course).toBeDefined();
      expect(course?.title).toBe("Test Course 1");
    });

    it("should throw an error when course is not found", async () => {
      const courseId = 999; // Non-existent course
      await expect(courseService.getCourseById(courseId)).rejects.toThrow(
        "Course ID [999] not found"
      );
      expect(createError).toHaveBeenCalledWith(
        "Course ID [999] not found",
        404
      );
    });
  });

  describe("updateCourseById", () => {
    it("should update a course successfully", async () => {
      const courseId = 1;
      const updatedData: Partial<Course> = {
        title: "Updated Course",
        description: "This is an updated test course",
      };

      const updatedCourse = await courseService.updateCourseById(
        courseId,
        updatedData
      );
      expect(updatedCourse?.title).toBe("Updated Course");

      // Verify the course is updated when fetching all courses
      const course = await courseService.getCourseById(courseId);
      expect(course?.title).toBe("Updated Course");
    });

    it("should throw an error when trying to update a non-existent course", async () => {
      const courseId = 999; // Non-existent course
      const updatedData: Partial<Course> = { title: "Does not exist" };

      await expect(
        courseService.updateCourseById(courseId, updatedData)
      ).rejects.toThrow("Course ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Course ID [999] not found",
        404
      );
    });
  });

  describe("deleteCourseById", () => {
    it("should delete a course successfully", async () => {
      const courseId = 1;
      await courseService.deleteCourseById(courseId);

      // Verify the course no longer exists
      const courses = await courseService.getAllCourses();
      expect(courses).toHaveLength(2);
    });

    it("should do nothing if trying to delete a non-existent course", async () => {
      const courseId = 999; // Non-existent course
      await expect(courseService.deleteCourseById(courseId)).rejects.toThrow(
        "Course ID [999] not found"
      );
      expect(createError).toHaveBeenCalledWith(
        "Course ID [999] not found",
        404
      );
    });
  });
});
