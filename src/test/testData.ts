import { Course } from "../models/course";
import { Lesson } from "../models/lesson";
import { Module } from "../models/module";

export const testLesson1: Lesson = {
  id: 1,
  title: "Lesson 1",
  description: "Lesson for testing",
  content: [],
  topics: ["Topic 1"],
  moduleId: 1,
};

export const testLesson2: Lesson = {
  id: 2,
  title: "Lesson 2",
  description: "Lesson 2 for testing",
  content: [],
  topics: ["Topic 2"],
  moduleId: 1,
};

export const testLesson3: Lesson = {
  id: 3,
  title: "Lesson 3",
  description: "Lesson 3for testing",
  content: [],
  topics: ["Topic 1"],
  moduleId: 2,
};

export const testLesson4: Lesson = {
  id: 4,
  title: "Lesson 4",
  description: "Lesson 4 for testing",
  content: [],
  topics: ["Topic 2"],
  moduleId: 2,
};

export const testModule1: Module = {
  id: 1,
  title: "Module 1",
  lessons: [testLesson1, testLesson2],
  lessonsId: [testLesson1.id, testLesson2.id],
  courseId: 1,
};

export const testModule2: Module = {
  id: 2,
  title: "Module 2",
  lessons: [testLesson3, testLesson4],
  lessonsId: [testLesson3.id, testLesson4.id],
  courseId: 2,
};

export const testCourse1: Course = {
  id: 1,
  title: "Test Course 1",
  description: "Course 1 for testing",
  modules: [testModule1],
  modulesId: [testModule1.id],
};

export const testCourse2: Course = {
  id: 2,
  title: "Test Course 2",
  description: "Course 2 for testing",
  modules: [testModule2],
  modulesId: [testModule2.id],
};
