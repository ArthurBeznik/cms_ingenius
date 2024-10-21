import { server } from "../../app";
import { FILE_PATHS } from "../../config/config";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";
import { Module } from "../../models/module";
import * as courseService from "../../services/course.service";
import createError from "../../utils/error";
import { readJSONFile, writeJSONFile } from "../../utils/fileUtils";
import { testCourse1, testCourse2 } from "../testData";

const lessonsFilePath = FILE_PATHS.LESSONS_FILE_PATH;
const coursesFilePath = FILE_PATHS.COURSES_FILE_PATH;
const modulesFilePath = FILE_PATHS.MODULES_FILE_PATH;

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

describe("Course Service Integration Tests", () => {
  beforeEach(async () => {
    await writeJSONFile(coursesFilePath, [testCourse1, testCourse2]);
  });

  afterAll(() => {
    if (server) {
      console.log(`Closing server on port ${process.env.PORT}`);
      server.close();
    }
  });

  describe("getAllCourses", () => {
    it("should return an empty array when no courses exist", async () => {
      const courses = await courseService.getAllCourses();
      expect(courses.length).toEqual(2);
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

      expect(addedCourse).toEqual(expect.objectContaining(newCourse));

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
      const courseId = 999;
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

      const course = await courseService.getCourseById(courseId);
      expect(course?.title).toBe("Updated Course");
    });

    it("should throw an error when trying to update a non-existent course", async () => {
      const courseId = 999;
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

      const courses = await courseService.getAllCourses();
      expect(courses).toHaveLength(1);
    });

    it("should do nothing if trying to delete a non-existent course", async () => {
      const courseId = 999;
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
