import {
  addCourse,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  updateCourseById,
} from "../../services/course.service";
import { readJSONFile, writeJSONFile } from "../../utils/fileUtils";
import createError from "../../utils/error";
import { Course } from "../../models/course";

// Mocks
jest.mock("../../utils/fileUtils", () => ({
  readJSONFile: jest.fn(),
  writeJSONFile: jest.fn(),
}));

jest.mock("../../utils/error", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }),
}));

describe("CourseService", () => {
  const mockCourses: Course[] = [
    {
      id: 1,
      title: "Course 1",
      description: "Description 1",
      modules: [],
      modulesId: [],
    },
    {
      id: 2,
      title: "Course 2",
      description: "Description 2",
      modules: [],
      modulesId: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getAllCourses tests
  describe("getAllCourses", () => {
    it("should fetch all courses successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);

      const result = await getAllCourses();
      expect(result).toEqual(mockCourses);

      expect(readJSONFile).toHaveBeenCalledWith(expect.any(String));
    });

    it("should throw an error if courses cannot be fetched", async () => {
      (readJSONFile as jest.Mock).mockResolvedValueOnce(null);

      await expect(getAllCourses()).rejects.toThrow(
        "Could not fetch courses.json"
      );

      expect(createError).toHaveBeenCalledWith(
        "Could not fetch courses.json",
        500
      );
    });
  });

  // getCourseById tests
  describe("getCourseById", () => {
    it("should fetch a course by ID successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);

      const result = await getCourseById(1);
      expect(result).toEqual(mockCourses[0]);
    });

    it("should throw an error if course with the given ID is not found", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);

      await expect(getCourseById(999)).rejects.toThrow(
        "Course ID [999] not found"
      );
      expect(createError).toHaveBeenCalledWith(
        "Course ID [999] not found",
        404
      );
    });
  });

  // addCourse tests
  describe("addCourse", () => {
    it("should add a new course successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);

      const newCourseData = {
        title: "New Course",
        description: "New Description",
      };

      const result = await addCourse(newCourseData);

      expect(result.title).toBe(newCourseData.title);
      expect(result.description).toBe(newCourseData.description);
      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the course cannot be added", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);
      (writeJSONFile as jest.Mock).mockRejectedValue(
        new Error("File write failed")
      );

      const newCourseData = {
        title: "New Course",
        description: "New Description",
      };

      await expect(addCourse(newCourseData)).rejects.toThrow(
        "File write failed"
      );
    });
  });

  // updateCourseById tests
  describe("updateCourseById", () => {
    it("should update a course by ID successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);

      const updatedData = { title: "Updated Course" };

      const result = await updateCourseById(1, updatedData);

      expect(result.title).toBe(updatedData.title);
      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if course with given ID is not found", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);

      await expect(
        updateCourseById(999, { title: "Updated Course" })
      ).rejects.toThrow("Course ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Course ID [999] not found",
        404
      );
    });
  });

  // deleteCourseById tests
  describe("deleteCourseById", () => {
    it("should delete a course by ID successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);

      await deleteCourseById(1);

      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if course with given ID is not found", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockCourses);

      await expect(deleteCourseById(999)).rejects.toThrow(
        "Course ID [999] not found"
      );
      expect(createError).toHaveBeenCalledWith(
        "Course ID [999] not found",
        404
      );
    });
  });
});
