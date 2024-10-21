# Course Management System (CMS) - InGenius

## Overview

This project is a **Course Management System (CMS)** backend built with **TypeScript** and **Node.js**, using JSON files for data persistence. The system handles course data management with endpoints for managing **courses**, **modules**, and **lessons**. The project is structured for scalability and maintainability, with features such as error handling, logging, validation, and testing.

## Table of Contents

- [Project Objectives](#project-objectives)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Input Validation](#input-validation)
- [Testing](#testing)
- [Data Persistence](#data-persistence)
- [Bonus Features](#bonus-features)
- [Configuration](#configuration)
- [Docker Setup](#docker-setup)
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

- **Node.js** (v14+)
- **npm** (or **yarn**)
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

1. **Configuration**
   The project uses a `config.ts` file located in `src/config` for environment settings (e.g., API version, port). You can modify this file as needed.

2. **Sample Data**
   Initial data for courses, modules, and lessons is stored in JSON files located in `data/`. Modify these JSON files (`courses.json`, `modules.json`, `lessons.json`) to seed the system with initial data.

## Running the Application

1. **Starting in Development Mode**

   ```bash
   npm run dev
   ```

   By default, the application will be accessible at `http://localhost:3000`.

2. **Starting in Production Mode**
   ```bash
   npm run build
   npm start
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

The project includes global error-handling middleware. It captures all errors and sends a JSON response with the appropriate HTTP status code and error message.

## Logging

API requests and errors are logged using **Winston**. This ensures structured logging for easier debugging and monitoring.

## Input Validation

Input data is validated using **Joi**. All API requests are checked for valid input before processing, ensuring that the correct data is passed through.

## Testing

**Jest** is used for unit and integration tests. To run the tests:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Data Persistence

Data is persisted in JSON files located in the `data/` directory:

- `courses.json`
- `modules.json`
- `lessons.json`

Efficient read/write operations are implemented to update these files.

## Configuration

The project uses a `config.ts` file located in `src/config` for managing environment-specific settings. This includes:

- **PORT**: Port for the server (default: `3000`).
- **API_VERSION**: Version of the API (default: `v1`).

Modify `config.ts` as per your environment.

## Docker Setup

1. **Build the Docker Image**

   ```bash
   docker-compose build
   ```

2. **Run the Docker Container**

   ```bash
   docker-compose up
   ```

3. **Stop the Docker Container**
   ```bash
   docker-compose down
   ```

## Troubleshooting

- **JSON File Write Issues**: Ensure that the `data/` directory has write permissions.
- **Swagger Not Working**: Check that the server is running on the correct port (`http://localhost:3000`).
