# Course Management System (CMS) - InGenius

## Overview

This project is a **Course Management System (CMS)** backend built with **TypeScript** and **Node.js**, using JSON files for data persistence. The system handles course data management with endpoints for managing **courses**, **modules**, and **lessons**.

## Table of Contents

- [Project Objectives](#project-objectives)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Input Validation](#input-validation)
- [Testing](#testing)
- [Data Persistence](#data-persistence)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Project Objectives

1. Develop a **RESTful API** for managing courses.
2. Implement **data persistence** using JSON files.
3. Ensure **type safety** and code quality with **TypeScript**.
4. Provide proper **error handling** and **logging**.
5. Create a **scalable architecture** following best practices.
6. **Bonus Features**: caching, pagination, rate-limiting, Docker support.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**
- **npm**
- **Docker** and **Docker Compose** (optional, for containerization)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ArthurBeznik/cms_ingenius.git
   cd cms_ingenius
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

## Setup

1. **Configure the Application**

   The project uses a `config.ts` file located in `src/config` to manage environment variables. Update the configuration to set key variables like `PORT` and `BASE_URL`. The file also defines paths to the JSON data files for courses, modules, and lessons.

   Modify the `config.ts` file as needed for your environment.

2. **Sample Data**

   Initial data for courses, modules, and lessons is stored in JSON files located in `data/`. Modify these files (`courses.json`, `modules.json`, `lessons.json`) to seed the system with initial data.

## Running the Application

### Running Locally

1. **Start the Application in Development Mode**

   ```bash
   npm run dev
   ```

   By default, the application will be accessible at `http://localhost:3000`.

2. **Start the Application in Production Mode**

   Build and start the app in production mode:

   ```bash
   npm run build
   npm start
   ```

### Docker Setup

The project includes separate Docker configurations for **development** and **production**. You can use the appropriate `docker-compose` file for your environment.

1. **Build the Docker Images**

   To build the Docker images for both environments, use:

   ```bash
   docker-compose -f docker-compose.dev.yml build   # For development
   docker-compose -f docker-compose.prod.yml build  # For production
   ```

2. **Run the Docker Containers**

   - **Development Mode:**

     ```bash
     docker-compose -f docker-compose.dev.yml up
     ```

   - **Production Mode:**

     ```bash
     docker-compose -f docker-compose.prod.yml up
     ```

   The application will be accessible at `http://localhost:3000`.

3. **Stop the Docker Containers**

   To stop the running Docker containers:

   ```bash
   docker-compose -f docker-compose.dev.yml down   # Development
   docker-compose -f docker-compose.prod.yml down  # Production
   ```

## Project Structure

- **`src/`**: Contains the core application code:

  - **`controllers/`**: Handle HTTP requests and responses for courses, modules, and lessons.
  - **`models/`**: Define data models for courses, modules, and lessons.
  - **`routes/`**: Define API routes.
  - **`services/`**: Core business logic for handling course data and in-memory operations.
  - **`config/`**: Contains `config.ts` for environment-specific configuration.
  - **`utils/`**: Helper functions for logging, validation, etc.

- **`data/`**: Stores JSON files (`courses.json`, `modules.json`, `lessons.json`) for data persistence.

## API Documentation

This API provides full CRUD operations for managing **courses**, **modules**, and **lessons**.

### Endpoints

1. **Courses**

   - `GET /api/courses`: Get all courses.
   - `POST /api/courses`: Create a new course.
   - `GET /api/courses/:id`: Get details of a specific course.
   - `PUT /api/courses/:id`: Update a course.
   - `DELETE /api/courses/:id`: Delete a course.

2. **Modules**

   - `GET /api/modules`: Get all modules.
   - `GET /api/modules/:moduleId`: Get module details.
   - `GET /api/courses/:courseId/modules`: Get all modules for a course.
   - `POST /api/courses/:courseId/modules`: Create a module for a course.
   - `GET /api/courses/:courseId/modules/:moduleId`: Get module details.
   - `PUT /api/courses/:courseId/modules/:moduleId`: Update a module.
   - `DELETE /api/courses/:courseId/modules/:moduleId`: Delete a module.

3. **Lessons**
   - `GET /api/lessons`: Get all lessons.
   - `GET /api/lessons/:lessonId`: Get lesson details.
   - `GET /api/courses/:courseId/modules/:moduleId/lessons`: Get all lessons in a module.
   - `POST /api/courses/:courseId/modules/:moduleId/lessons`: Add a lesson to a module.
   - `GET /api/courses/:courseId/modules/:moduleId/lessons/:lessonId`: Get lesson details.
   - `PUT /api/courses/:courseId/modules/:moduleId/lessons/:lessonId`: Update a lesson.
   - `DELETE /api/courses/:courseId/modules/:moduleId/lessons/:lessonId`: Delete a lesson.

### Swagger Documentation

Access the Swagger UI to explore and test API endpoints:

```
http://localhost:3000/api-docs
```

## Error Handling

The project includes global error-handling middleware, which captures all errors and sends a JSON response with the appropriate HTTP status code and error message.

## Logging

API requests and errors are logged using **Winston** for structured logging to assist with debugging and monitoring.

## Input Validation

Input data is validated using **Joi** to ensure correct data is passed to API endpoints.

## Testing

The project uses **Jest** for unit and integration testing. To run the tests:

```bash
npm run test
```

## Data Persistence

Data is persisted in JSON files located in the `data/` directory:

- `courses.json`
- `modules.json`
- `lessons.json`

Efficient read/write operations are implemented to update these files.

## Troubleshooting

- **JSON File Write Issues**: Ensure that the `data/` directory has write permissions.
- **Swagger Not Working**: Check that the server is running on the correct port (`http://localhost:3000`).
