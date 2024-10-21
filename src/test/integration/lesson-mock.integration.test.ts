import request from "supertest";
import app, { server } from "../../app";
import * as lessonService from "../../services/lesson.service";
import { Lesson } from "../../models/lesson";
import createError from "../../utils/error";
import { PORT } from "../../config/config";

jest.mock("../../services/lesson.service");

beforeAll(() => {
  process.env.PORT = `${Math.floor(Math.random() * 1000) + 3000}`;
  console.log(`Setting server on port ${process.env.PORT}`);
});

describe("Lesson Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (server) {
      console.log(`Closing server on port ${process.env.PORT || PORT}`);
      server.close();
    }
  });

  const mockLesson: Lesson = {
    id: 1,
    title: "Lesson 1",
    description: "Description 1",
    content: [],
    topics: [],
    moduleId: 1,
  };

  const mockLessons: Lesson[] = [
    {
      id: 1,
      title: "Lesson 1",
      description: "Description 1",
      content: [],
      topics: [],
      moduleId: 1,
    },
    {
      id: 2,
      title: "Lesson 2",
      description: "Description 2",
      content: [],
      topics: [],
      moduleId: 1,
    },
  ];

  describe("GET /lessons", () => {
    it("should return all lessons", async () => {
      (lessonService.getAllLessons as jest.Mock).mockResolvedValue(mockLessons);

      const response = await request(app).get("/api/lessons");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockLessons);
    });
  });

  describe("GET /lessons/:lessonId", () => {
    it("should return a lesson successfully", async () => {
      (lessonService.getLessonById as jest.Mock).mockResolvedValue(mockLesson);

      const response = await request(app).get("/api/lessons/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLesson);
    });
  });

  describe("GET /courses/:courseId/modules/:moduleId/lessons", () => {
    it("should return all lessons in a module from a course successfully", async () => {
      (lessonService.getAllLessons as jest.Mock).mockResolvedValue(mockLessons);

      const response = await request(app).get(
        "/api/courses/1/modules/1/lessons"
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockLessons);
    });

    it("should return 404 if no lessons found", async () => {
      (lessonService.getAllLessons as jest.Mock).mockRejectedValue(
        createError("Module ID 2 not found", 404)
      );

      const response = await request(app).get(
        "/api/courses/1/modules/1/lessons"
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Module ID 2 not found");
    });
  });

  describe("GET /courses/:courseId/modules/:moduleId/lessons/:lessonId", () => {
    it("should return a lesson successfully", async () => {
      (lessonService.getLessonById as jest.Mock).mockResolvedValue(mockLesson);

      const response = await request(app).get(
        "/api/courses/1/modules/1/lessons/1"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLesson);
    });

    it("should return 404 if lesson not found", async () => {
      (lessonService.getLessonById as jest.Mock).mockRejectedValue(
        createError("Lesson not found", 404)
      );

      const response = await request(app).get(
        "/api/courses/1/modules/1/lessons/999"
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Lesson not found");
    });
  });

  describe("POST /courses/:courseId/modules/:moduleId/lessons", () => {
    it("should create a new lesson successfully", async () => {
      const newLessonData: Partial<Lesson> = {
        title: "New Lesson",
        description: "This is a new lesson.",
        content: [{ type: "audio", data: "content data" }],
        topics: ["Topic 1"],
      };

      const mockNewLesson = {
        id: 1,
        ...newLessonData,
        moduleId: 1,
      };

      (lessonService.addLesson as jest.Mock).mockResolvedValue(mockNewLesson);

      const response = await request(app)
        .post("/api/courses/1/modules/1/lessons")
        .send(newLessonData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(mockNewLesson));
    });

    it("should return 400 if input validation fails (missing title)", async () => {
      const newLessonData = {
        description: "This is a new lesson.",
        content: [{ type: "audio", data: "content data" }],
        topics: ["Topic 1"],
      };

      const response = await request(app)
        .post("/api/courses/1/modules/1/lessons")
        .send(newLessonData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('"title" is required');
    });
  });

  describe("PUT /courses/:courseId/modules/:moduleId/lessons/:lessonId", () => {
    it("should update a lesson successfully", async () => {
      const updateLessonData: Partial<Lesson> = {
        title: "Updated Lesson",
        description: "This is an updated lesson.",
        content: [{ type: "audio", data: "updated content data" }],
        topics: ["Updated Topic 1"],
      };

      const mockUpdatedLesson = {
        id: 1,
        ...updateLessonData,
        moduleId: 1,
      };

      (lessonService.updateLessonById as jest.Mock).mockResolvedValue(
        mockUpdatedLesson
      );

      const response = await request(app)
        .put("/api/courses/1/modules/1/lessons/1")
        .send(updateLessonData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(mockUpdatedLesson));
    });

    it("should return 404 if lesson not found for update", async () => {
      const updateLessonData: Partial<Lesson> = {
        title: "Updated Lesson",
        description: "This is an updated lesson.",
        content: [{ type: "audio", data: "updated content data" }],
        topics: ["Updated Topic 1"],
      };

      (lessonService.updateLessonById as jest.Mock).mockRejectedValue(
        createError("Lesson not found", 404)
      );

      const response = await request(app)
        .put("/api/courses/1/modules/1/lessons/999")
        .send(updateLessonData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Lesson not found");
    });
  });

  describe("DELETE /courses/:courseId/modules/:moduleId/lessons/:lessonId", () => {
    it("should delete a lesson successfully", async () => {
      (lessonService.deleteLessonById as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete(
        "/api/courses/1/modules/1/lessons/1"
      );

      expect(response.status).toBe(204);
      expect(response.body.message).toBe(undefined);
    });

    it("should return 404 if lesson not found for deletion", async () => {
      (lessonService.deleteLessonById as jest.Mock).mockRejectedValue(
        createError("Lesson not found", 404)
      );

      const response = await request(app).delete(
        "/api/courses/1/modules/1/lessons/999"
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Lesson not found");
    });
  });
});
