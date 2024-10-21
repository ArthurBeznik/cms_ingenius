import {
  getAllModules,
  getModuleById,
  addModule,
  updateModuleById,
  deleteModuleById,
} from "../../services/module.service";
import { readJSONFile, writeJSONFile } from "../../utils/fileUtils";
import { Course } from "../../models/course";
import { Module } from "../../models/module";
import {
  getAllCourses,
  getCourseById,
  updateCourseById,
} from "../../services/course.service";
import createError from "../../utils/error";
import { FILE_PATHS } from "../../config/config";

jest.mock("../../utils/fileUtils", () => ({
  readJSONFile: jest.fn(),
  writeJSONFile: jest.fn(),
}));

jest.mock("../../services/course.service", () => ({
  getCourseById: jest.fn(),
  updateCourseById: jest.fn(),
}));

jest.mock("../../utils/error", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((message, statusCode) => {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }),
}));

describe("ModuleService", () => {
  const mockModules: Module[] = [
    {
      id: 1,
      title: "Module 1",
      lessons: [],
      lessonsId: [],
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
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // getAllModules tests
  describe("getAllModules", () => {
    it("should fetch all modules successfully if no courseId is provided", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockModules);

      const result = await getAllModules();
      expect(result).toEqual(mockModules);
      expect(readJSONFile).toHaveBeenCalledWith(expect.any(String));
    });

    it("should fetch modules by courseId successfully", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const result = await getAllModules(1);
      expect(result).toEqual(mockModules);
      expect(getCourseById).toHaveBeenCalledWith(1);
    });

    it("should throw an error if modules cannot be fetched", async () => {
      (readJSONFile as jest.Mock).mockResolvedValueOnce(null);

      await expect(getAllModules()).rejects.toThrow(
        "Could not fetch modules.json"
      );
      expect(createError).toHaveBeenCalledWith(
        "Could not fetch modules.json",
        500
      );
    });
  });

  // getModuleById tests
  describe("getModuleById", () => {
    it("should fetch a module by ID successfully", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const result = await getModuleById(1, 1);
      expect(result).toEqual(mockModules[0]);
    });

    it("should throw an error if module with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      await expect(getModuleById(1, 999)).rejects.toThrow(
        "Module ID [999] not found"
      );
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found",
        404
      );
    });
  });

  // addModule tests
  describe("addModule", () => {
    it("should add a new module to the course successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockModules);
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const newModuleData = { title: "New Module" };

      const result = await addModule(newModuleData, 1);

      expect(result.title).toBe(newModuleData.title);
      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the course cannot be found", async () => {
      (getCourseById as jest.Mock).mockRejectedValue(
        new Error("Course not found")
      );

      const newModuleData = { title: "New Module" };

      await expect(addModule(newModuleData, 999)).rejects.toThrow(
        "Course not found"
      );
    });
  });

  // updateModuleById tests
  describe("updateModuleById", () => {
    it("should update a module successfully", async () => {
      (readJSONFile as jest.Mock).mockResolvedValue(mockModules);
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const updatedData = { title: "Updated Module" };

      const result = await updateModuleById(1, updatedData, 1);

      expect(result.title).toBe(updatedData.title);
      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the module with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      await expect(
        updateModuleById(999, { title: "Updated Module" }, 1)
      ).rejects.toThrow("Module ID [999] not found in course ID [1]");
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found in course ID [1]",
        404
      );
    });

    it("should throw an error if the course with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockRejectedValue(
        new Error("Course ID [999] not found")
      );

      await expect(
        updateModuleById(1, { title: "Updated Module" }, 999)
      ).rejects.toThrow("Course ID [999] not found");
    });
  });

  // deleteModuleById tests
  describe("deleteModuleById", () => {
    it("should delete a module successfully", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (readJSONFile as jest.Mock).mockImplementation((filePath: string) => {
        if (filePath === FILE_PATHS.MODULES_FILE_PATH) {
          return Promise.resolve(mockModules);
        } else if (filePath === FILE_PATHS.COURSES_FILE_PATH) {
          return Promise.resolve(mockCourses);
        }
        return Promise.resolve([]);
      });
      (writeJSONFile as jest.Mock).mockResolvedValue(undefined);

      await deleteModuleById(1, 1);

      expect(getCourseById).toHaveBeenCalledWith(1);

      expect(writeJSONFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array)
      );
    });

    it("should throw an error if the module with the given ID is not found", async () => {
      (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      await expect(deleteModuleById(1, 999)).rejects.toThrow(
        "Module ID [999] not found in course ID [1]"
      );
      expect(createError).toHaveBeenCalledWith(
        "Module ID [999] not found in course ID [1]",
        404
      );
    });
  });
});
