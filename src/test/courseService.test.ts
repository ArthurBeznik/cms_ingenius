import { promises as fs } from "fs";
import path from "path";
import { Course } from "../models/course";
import {
  getCourses,
  getCourseById,
  addCourse,
  updateCourseById,
} from "../services/courseService";

// Mocking the file system
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

const mockCourses: Course[] = [
  { id: 1, title: "Course 1", description: "Description 1", modules: [] },
  { id: 2, title: "Course 2", description: "Description 2", modules: [] },
];

describe("Course Service", () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("getCourses", () => {
    it("should return all courses", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCourses)
      );

      const courses = await getCourses();
      expect(courses).toEqual(mockCourses);
      expect(fs.readFile).toHaveBeenCalledWith(
        path.resolve(__dirname, "../data/courses.json"),
        "utf-8"
      );
    });

    it("should throw an error if courses cannot be fetched", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(null);

      await expect(getCourses()).rejects.toThrow(
        "Could not fetch courses.json"
      );
    });
  });

  describe("getCourseById", () => {
    it("should return a course by ID", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCourses)
      );

      const course = await getCourseById(1);
      expect(course).toEqual(mockCourses[0]);
    });

    it("should throw an error if the course is not found", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCourses)
      );

      await expect(getCourseById(3)).rejects.toThrow(
        "Could not find course with ID: 3"
      );
    });
  });

  describe("addCourse", () => {
    it("should add a new course", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCourses)
      );
      (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      const newCourse: Course = {
        id: 3,
        title: "Course 3",
        description: "Description 3",
        modules: [],
      };
      await addCourse(newCourse);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.resolve(__dirname, "../data/courses.json"),
        JSON.stringify([...mockCourses, newCourse], null, 2),
        "utf-8"
      );
    });

    it("should throw an error if the course already exists", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCourses)
      );

      const newCourse: Course = {
        id: 1,
        title: "Course 1",
        description: "Description 1",
        modules: [],
      };
      await expect(addCourse(newCourse)).rejects.toThrow(
        "Course with ID 1 already exists"
      );
    });
  });

  describe("updateCourseById", () => {
    it("should update an existing course", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCourses)
      );
      (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

      const updatedData = { title: "Updated Course 1" };
      const updatedCourse = await updateCourseById(1, updatedData);

      expect(updatedCourse).toEqual({ ...mockCourses[0], ...updatedData });
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.resolve(__dirname, "../data/courses.json"),
        JSON.stringify(
          [{ ...mockCourses[0], ...updatedData }, mockCourses[1]],
          null,
          2
        ),
        "utf-8"
      );
    });

    it("should throw an error if the course is not found", async () => {
      (fs.readFile as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCourses)
      );

      const updatedData = { title: "Updated Course 3" };
      await expect(updateCourseById(3, updatedData)).rejects.toThrow(
        "Course with ID 3 not found"
      );
    });
  });
});
