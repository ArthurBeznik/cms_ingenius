import { BaseEntity } from "./base";

interface Content {
  type: "text" | "video" | "audio";
  data: string;
}

export interface Lesson extends BaseEntity {
  description: string;
  topics: string[];
  content: Content[];
  moduleId: number;
}
