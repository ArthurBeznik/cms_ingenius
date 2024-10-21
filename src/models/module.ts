import { BaseEntity } from "./base";
import { Lesson } from "./lesson";

export interface Module extends BaseEntity {
  lessons: Lesson[];
  lessonsId: number[];
  courseId?: number;
}
