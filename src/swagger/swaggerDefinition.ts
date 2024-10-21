import swaggerJSDoc from "swagger-jsdoc";
import components from "./components";
import paths from "./paths";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description:
      "Documentation for the API endpoints. \
      Backend system for a Course Management System using TypeScript and Node.js. \
      The system handles course data management and persists data in JSON files instead of a traditional database.",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
    },
  ],
  tags: [
    {
      name: "Courses",
      description:
        "Operations related to courses (e.g., creating, retrieving, updating courses)",
    },
    {
      name: "Modules",
      description:
        "Operations related to modules within courses (e.g., adding, retrieving, updating modules)",
    },
    {
      name: "Lessons",
      description:
        "Operations related to lessons within modules of a course (e.g., creating, retrieving, updating lessons)",
    },
  ],
  components,
  paths,
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
