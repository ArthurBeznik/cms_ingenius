import request from "supertest";
import app, { server } from "../../app";
import { Course } from "../../models/course";
import * as courseService from "../../services/course.service";
import createError from "../../utils/error";

jest.mock("../../services/course.service");

describe("Course Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  const mockCourse: Course = {
    id: 1,
    title: "Course 1",
    description: "Description 1",
    modules: [],
    modulesId: [],
  };

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

  describe("GET /courses", () => {
    it("should return all courses", async () => {
      (courseService.getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

      const response = await request(app).get("/api/courses");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCourses);
    });
  });

  describe("GET /courses/:courseId", () => {
    it("should return a course successfully", async () => {
      (courseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app).get("/api/courses/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourse);
    });

    it("should return 404 if course not found", async () => {
      (courseService.getCourseById as jest.Mock).mockRejectedValue(
        createError("Course not found", 404)
      );

      const response = await request(app).get("/api/courses/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Course not found");
    });
  });

  describe("POST /courses", () => {
    it("should create a new course successfully", async () => {
      const newCourseData: Partial<Course> = {
        title: "New Course",
        description: "This is a new course.",
      };

      const mockNewCourse = {
        id: 1,
        ...newCourseData,
        moduleIds: [],
      };

      (courseService.addCourse as jest.Mock).mockResolvedValue(mockNewCourse);

      const response = await request(app)
        .post("/api/courses")
        .send(newCourseData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(mockNewCourse));
    });

    it("should return 400 if input validation fails (missing title)", async () => {
      const newCourseData = {
        description: "This is a new course.",
      };

      const response = await request(app)
        .post("/api/courses")
        .send(newCourseData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('"title" is required');
    });
  });

  describe("PUT /courses/:courseId", () => {
    it("should update a course successfully", async () => {
      const updateCourseData: Partial<Course> = {
        title: "Updated Course",
        description: "This is an updated course.",
      };

      const mockUpdatedCourse = {
        id: 1,
        ...updateCourseData,
        moduleIds: [],
      };

      (courseService.updateCourseById as jest.Mock).mockResolvedValue(
        mockUpdatedCourse
      );

      const response = await request(app)
        .put("/api/courses/1")
        .send(updateCourseData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(mockUpdatedCourse));
    });

    it("should return 404 if course not found for update", async () => {
      const updateCourseData: Partial<Course> = {
        title: "Updated Course",
        description: "This is an updated course.",
      };

      (courseService.updateCourseById as jest.Mock).mockRejectedValue(
        createError("Course not found", 404)
      );

      const response = await request(app)
        .put("/api/courses/999")
        .send(updateCourseData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Course not found");
    });
  });

  describe("DELETE /courses/:courseId", () => {
    it("should delete a course successfully", async () => {
      (courseService.deleteCourseById as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete("/api/courses/1");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should return 404 if course not found for deletion", async () => {
      (courseService.deleteCourseById as jest.Mock).mockRejectedValue(
        createError("Course not found", 404)
      );

      const response = await request(app).delete("/api/courses/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Course not found");
    });
  });
});
