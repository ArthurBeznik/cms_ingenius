import request from "supertest";
import app, { server } from "../../app";
import { Module } from "../../models/module";
import * as moduleService from "../../services/module.service";
import createError from "../../utils/error";

jest.mock("../../services/module.service");

beforeAll(() => {
  process.env.PORT = `${Math.floor(Math.random() * 1000) + 3000}`;
  console.log(`Setting server on port ${process.env.PORT}`);
});

describe("Module Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (server) {
      console.log(`Closing server on port ${process.env.PORT}`);
      server.close();
    }
  });

  const mockModule: Module = {
    id: 1,
    title: "Module 1",
    lessons: [],
    lessonsId: [],
    courseId: 1,
  };

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

  describe("GET /courses/:courseId/modules", () => {
    it("should return all modules in a course", async () => {
      (moduleService.getAllModules as jest.Mock).mockResolvedValue(mockModules);

      const response = await request(app).get("/api/courses/1/modules");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockModules);
    });

    it("should return 404 if no modules found", async () => {
      (moduleService.getAllModules as jest.Mock).mockRejectedValue(
        createError("Modules not found", 404)
      );

      const response = await request(app).get("/api/courses/1/modules");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Modules not found");
    });
  });

  describe("GET /courses/:courseId/modules/:moduleId", () => {
    it("should return a module successfully", async () => {
      (moduleService.getModuleById as jest.Mock).mockResolvedValue(mockModule);

      const response = await request(app).get("/api/courses/1/modules/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockModule);
    });

    it("should return 404 if module not found", async () => {
      (moduleService.getModuleById as jest.Mock).mockRejectedValue(
        createError("Module not found", 404)
      );

      const response = await request(app).get("/api/courses/1/modules/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Module not found");
    });
  });

  describe("POST /courses/:courseId/modules", () => {
    it("should create a new module successfully", async () => {
      const newModuleData: Partial<Module> = {
        title: "New Module",
      };

      const mockNewModule = {
        id: 1,
        ...newModuleData,
        courseId: 1,
        lessonIds: [],
      };

      (moduleService.addModule as jest.Mock).mockResolvedValue(mockNewModule);

      const response = await request(app)
        .post("/api/courses/1/modules")
        .send(newModuleData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(mockNewModule));
    });

    it("should return 400 if input validation fails (missing title)", async () => {
      const newModuleData = {
        description: "This is a new module.",
      };

      const response = await request(app)
        .post("/api/courses/1/modules")
        .send(newModuleData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('"title" is required');
    });
  });

  describe("PUT /courses/:courseId/modules/:moduleId", () => {
    it("should update a module successfully", async () => {
      const updateModuleData: Partial<Module> = {
        title: "Updated Module",
      };

      const mockUpdatedModule = {
        id: 1,
        ...updateModuleData,
        courseId: 1,
        lessonIds: [],
      };

      (moduleService.updateModuleById as jest.Mock).mockResolvedValue(
        mockUpdatedModule
      );

      const response = await request(app)
        .put("/api/courses/1/modules/1")
        .send(updateModuleData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(mockUpdatedModule));
    });

    it("should return 404 if module not found for update", async () => {
      const updateModuleData: Partial<Module> = {
        title: "Updated Module",
      };

      (moduleService.updateModuleById as jest.Mock).mockRejectedValue(
        createError("Module not found", 404)
      );

      const response = await request(app)
        .put("/api/courses/1/modules/999")
        .send(updateModuleData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Module not found");
    });
  });

  describe("DELETE /courses/:courseId/modules/:moduleId", () => {
    it("should delete a module successfully", async () => {
      (moduleService.deleteModuleById as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete("/api/courses/1/modules/1");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should return 404 if module not found for deletion", async () => {
      (moduleService.deleteModuleById as jest.Mock).mockRejectedValue(
        createError("Module not found", 404)
      );

      const response = await request(app).delete("/api/courses/1/modules/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Module not found");
    });
  });
});
