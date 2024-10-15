
interface Content {
  type: "text" | "video" | "audio";
  data: string;
}

export interface Lesson {
  title: string;
  description: string;
  topics: string[];
  content: Content[];
}
