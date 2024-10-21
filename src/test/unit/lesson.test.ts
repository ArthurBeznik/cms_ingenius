import {
  getAllLessons,
  getLessonById,
  addLesson,
  updateLessonById,
  deleteLessonById,
} from "../../services/lesson.service";
import { readJSONFile, writeJSONFile } from "../../utils/fileUtils";
import { Course } from "../../models/course";
import { Lesson } from "../../models/lesson";
import { getCourseById, getAllCourses } from "../../services/course.service";
import createError from "../../utils/error";
import { FILE_PATHS } from "../../config/config";
import { Module } from "../../models/module";
import {
  getAllModules,
  getModuleById,
  updateModuleById,
} from "../../services/module.service";
import { server } from "../../app";

jest.mock("../../utils/fileUtils", () => ({
  readJSONFile: jest.fn(),
  writeJSONFile: jest.fn(),
}));

jest.mock("../../services/course.service", () => ({
  getCourseById: jest.fn(),
  getAllCourses: jest.fn(),
  updateCourseById: jest.fn(),
}));

jest.mock("../../services/module.service", () => ({
  updateModuleById: jest.fn(),
  getModuleById: jest.fn(),
  getAllModules: jest.fn(),
}));

jest.mock("../../utils/error", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }),
}));

describe("LessonService", () => {
  const mockLessons: Lesson[] = [
    {
      id: 1,
      title: "Lesson 1",
      description: "Description 1",
      content: [
        { type: "text", data: "Text content" },
        { type: "video", data: "https://example.com/video" },
      ],
      topics: ["Topic 1", "Topic 2"],
      moduleId: 1,
    },
    {
      id: 2,
      title: "Lesson 2",
      description: "Description 2",
      content: [{ type: "text", data: "Text content" }],
      topics: ["Topic 3"],
      moduleId: 1,
    },
  ];

  const mockModule: Module = {
    id: 1,
    title: "Module 1",
    lessons: mockLessons,
    lessonsId: [1, 2],
    courseId: 1,
  };

  const mockModules: Module[] = [
    {
      id: 1,
      title: "Module 1",
      lessons: mockLessons,
      lessonsId: [1, 2],
      courseId: 1,
    },
    {
      id: 2,
      title: "Module 2",
      lessons: [],
      lessonsId: [],
      courseId: 1,
    },
  ];

  const mockCourse: Course = {
    id: 1,
    title: "Course 1",
    description: "Description 1",
    modules: mockModules,
    modulesId: [1, 2],
  };

  const mockCourses = [
    {
      id: 1,
      title: "Course 1",
      description: "Description 1",
      modules: mockModules,
      modulesId: [1, 2],
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

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  // getAllLessons tests
  describe("getAllLessons", () => {
    it("should fetch all lessons successfully if no moduleId and courseId are provided", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockLessons);
      (getModuleById as jest.Mock).mockResolvedValue(mockModule);

      const result = await getAllLessons();
      expect(result).toEqual(mockLessons);
      expect(readJSONFile).toHaveBeenCalledWith(expect.any(String));
    });

    it("should fetch lessons by moduleId and courseId successfully", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (getModuleById as jest.Mock).mockResolvedValue(mockModule);

      const result = await getAllLessons(1, 1);
      expect(result).toEqual(mockLessons);
    });

    it("should throw an error if lessons cannot be fetched", async () => {
      (readJSONFile as jest.Mock).mockResolvedValueOnce(null);

      await expect(getAllLessons()).rejects.toThrow(
        "Could not fetch lessons.json"
      );
      expect(createError).toHaveBeenCalledWith(
        "Could not fetch lessons.json",
        500
      );
    });
  });

  // getLessonById tests
  describe("getLessonById", () => {
    it("should fetch a lesson by ID successfully", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const result = await getLessonById(1);
      expect(result).toEqual(mockLessons[0]);
    });

    it("should throw an error if lesson with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      await expect(getLessonById(999)).rejects.toThrow(
        "Lesson ID [999] not found"
      );
      expect(createError).toHaveBeenCalledWith(
        "Lesson ID [999] not found",
        404
      );
    });
  });

  // addLesson tests
  describe("addLesson", () => {
    it("should add a new lesson to the module successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockLessons);
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);
      (getAllModules as jest.Mock).mockResolvedValue(mockModules);

      const newLessonData: Partial<Lesson> = {
        title: "New Lesson",
        description: "New Lesson Description",
        content: [{ type: "text", data: "Text content" }],
        topics: ["New Topic"],
      };

      const result = await addLesson(newLessonData, 1, 1);

      expect(result.title).toBe(newLessonData.title);
      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the course cannot be found", async () => {
      (getCourseById as jest.Mock).mockRejectedValue(
        new Error("Course not found")
      );

      (getAllCourses as jest.Mock).mockResolvedValue([]);

      const newLessonData: Partial<Lesson> = {
        title: "New Lesson",
        description: "New Lesson Description",
        content: [{ type: "text", data: "Text content" }],
        topics: ["New Topic"],
      };

      await expect(addLesson(newLessonData, 999, 1)).rejects.toThrow(
        "Course not found"
      );
    });

    it("should throw an error if the module cannot be found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

      const newLessonData: Partial<Lesson> = {
        title: "New Lesson",
        description: "New Lesson Description",
        content: [{ type: "text", data: "Text content" }],
        topics: ["New Topic"],
      };

      await expect(addLesson(newLessonData, 1, 999)).rejects.toThrow(
        "Module ID [999] not found in course ID [1]"
      );
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found in course ID [1]",
        404
      );
    });
  });

  // updateLessonById tests
  describe("updateLessonById", () => {
    it("should update a lesson successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockLessons);
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);
      (getAllModules as jest.Mock).mockResolvedValue(mockModules);

      const updatedData = { title: "Updated Lesson" };

      const result = await updateLessonById(updatedData, 1, 1, 1);

      expect(result.title).toBe(updatedData.title);
      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the lesson with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      await expect(
        updateLessonById({ title: "Updated Lesson" }, 999, 1, 1)
      ).rejects.toThrow("Lesson ID [999] not found");
      expect(createError).toHaveBeenCalledWith(
        "Lesson ID [999] not found",
        404
      );
    });
  });

  // deleteLessonById tests
  describe("deleteLessonById", () => {
    it("should delete a lesson successfully", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (getAllCourses as jest.Mock).mockResolvedValue(mockCourses);
      (readJSONFile as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath === FILE_PATHS.LESSONS_FILE_PATH) {
          return Promise.resolve(mockLessons);
        } else if (filePath === FILE_PATHS.COURSES_FILE_PATH) {
          return Promise.resolve(mockCourses);
        }
        return Promise.resolve([]);
      });
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);

      await deleteLessonById(1, 1, 1);

      expect(getCourseById).toHaveBeenCalledWith(1);

      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the lesson with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      await expect(deleteLessonById(999, 1, 1)).rejects.toThrow(
        "Lesson ID [999] not found"
      );
      expect(createError).toHaveBeenCalledWith(
        "Lesson ID [999] not found",
        404
      );
    });

    it("should throw an error if the module with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      await expect(deleteLessonById(1, 1, 999)).rejects.toThrow(
        "Module ID [999] not found in course ID [1]"
      );
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found in course ID [1]",
        404
      );
    });
  });
});
