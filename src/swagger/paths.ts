const paths = {
  "/courses": {
    get: {
      summary: "Retrieve a list of all courses",
      tags: ["Courses"],
      responses: {
        200: {
          description: "A list of courses",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Course",
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Create a new course",
      tags: ["Courses"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Course",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Course created successfully",
        },
      },
    },
  },
  "/courses/{courseId}": {
    get: {
      summary: "Retrieve a specific course by its ID",
      tags: ["Courses"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course to retrieve",
        },
      ],
      responses: {
        200: {
          description: "Course details",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Course",
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Update a specific course by its ID",
      tags: ["Courses"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course to update",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Course",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Course updated successfully",
        },
        404: {
          description: "Course not found",
        },
      },
    },
    delete: {
      summary: "Delete a specific course by its ID",
      tags: ["Courses"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course to delete",
        },
      ],
      responses: {
        200: {
          description: "Course deleted successfully",
        },
        404: {
          description: "Course not found",
        },
      },
    },
  },
  "/modules": {
    get: {
      summary: "Retrieve a list of all modules",
      tags: ["Modules"],
      responses: {
        200: {
          description: "A list of all modules",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Module",
                },
              },
            },
          },
        },
      },
    },
  },
  "/modules/{moduleId}": {
    get: {
      summary: "Retrieve a module by its ID",
      tags: ["Modules"],
      parameters: [
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module",
        },
      ],
      responses: {
        200: {
          description: "Module details",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Module",
                },
              },
            },
          },
        },
        404: {
          description: "Module not found",
        },
      },
    },
  },
  "/courses/{courseId}/modules": {
    get: {
      summary: "Retrieve a list of all modules for a specific course",
      tags: ["Modules"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
      ],
      responses: {
        200: {
          description: "A list of modules for the specified course",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Module",
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Create a new module for a specific course",
      tags: ["Modules"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Module",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Module created successfully",
        },
      },
    },
  },
  "/courses/{courseId}/modules/{moduleId}": {
    get: {
      summary: "Retrieve a specific module by its ID for a specific course",
      tags: ["Modules"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module to retrieve",
        },
      ],
      responses: {
        200: {
          description: "Module details",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Module",
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Update a specific module by its ID for a specific course",
      tags: ["Modules"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module to update",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Module",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Module updated successfully",
        },
        404: {
          description: "Module not found",
        },
      },
    },
    delete: {
      summary: "Delete a specific module by its ID for a specific course",
      tags: ["Modules"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module to delete",
        },
      ],
      responses: {
        200: {
          description: "Module deleted successfully",
        },
        404: {
          description: "Module not found",
        },
      },
    },
  },
  "/lessons": {
    get: {
      summary: "Retrieve a list of all lessons",
      tags: ["Lessons"],
      responses: {
        200: {
          description: "A list of all lessons",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Lesson",
                },
              },
            },
          },
        },
      },
    },
  },
  "/lessons/{lessonId}": {
    get: {
      summary: "Retrieve a lesson by its ID",
      tags: ["Lessons"],
      parameters: [
        {
          in: "path",
          name: "lessonId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the lesson",
        },
      ],
      responses: {
        200: {
          description: "Lesson details",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Lesson",
                },
              },
            },
          },
        },
        404: {
          description: "Lesson not found",
        },
      },
    },
  },
  "/courses/{courseId}/modules/{moduleId}/lessons": {
    get: {
      summary: "Get all lessons for a specific module in a course",
      tags: ["Lessons"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module",
        },
      ],
      responses: {
        200: {
          description: "The list of lessons in the module",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Lesson",
                },
              },
            },
          },
        },
        404: {
          description: "Course or Module not found",
        },
      },
    },
    post: {
      summary: "Create a new lesson for a specific module in a course",
      tags: ["Lessons"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Lesson",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Lesson created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Lesson",
              },
            },
          },
        },
        400: {
          description: "Bad request",
        },
      },
    },
  },
  "/courses/{courseId}/modules/{moduleId}/lessons/{lessonId}": {
    get: {
      summary: "Get a specific lesson by its ID within a module of a course",
      tags: ["Lessons"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module",
        },
        {
          in: "path",
          name: "lessonId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the lesson to retrieve",
        },
      ],
      responses: {
        200: {
          description: "Lesson details",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Lesson",
              },
            },
          },
        },
        404: {
          description: "Lesson not found",
        },
      },
    },
    put: {
      summary: "Update a specific lesson by its ID",
      tags: ["Lessons"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module",
        },
        {
          in: "path",
          name: "lessonId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the lesson to update",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Lesson",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Lesson updated successfully",
        },
        404: {
          description: "Lesson not found",
        },
      },
    },
    delete: {
      summary: "Delete a specific lesson by its ID",
      tags: ["Lessons"],
      parameters: [
        {
          in: "path",
          name: "courseId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the course",
        },
        {
          in: "path",
          name: "moduleId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the module",
        },
        {
          in: "path",
          name: "lessonId",
          schema: {
            type: "integer",
          },
          required: true,
          description: "Numeric ID of the lesson to delete",
        },
      ],
      responses: {
        200: {
          description: "Lesson deleted successfully",
        },
        404: {
          description: "Lesson not found",
        },
      },
    },
  },
};

export default paths;
