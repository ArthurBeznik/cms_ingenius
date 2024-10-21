const components = {
  schemas: {
    Course: {
      type: "object",
      required: ["title", "description"],
      properties: {
        id: {
          type: "integer",
          description: "The auto-generated ID of the course",
        },
        title: {
          type: "string",
          description: "The title of the course",
        },
        description: {
          type: "string",
          description: "A brief description of the course",
        },
        modules: {
          type: "array",
          items: {
            $ref: "#/components/schemas/Module",
          },
        },
      },
      example: {
        title: "Learn HTML",
        description: "An introductory course on HTML.",
        modules: [
          {
            title: "HTML Basics",
            lessons: [
              {
                title: "Introduction to HTML",
                description: "Learn the basics of HTML structure and elements.",
                topics: ["HTML tags", "Document structure"],
                content: [
                  {
                    type: "text",
                    data: "HTML is the standard markup language for creating web pages.",
                  },
                  {
                    type: "video",
                    data: "https://example.com/intro-to-html",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    Module: {
      type: "object",
      required: ["title", "lessons"],
      properties: {
        id: {
          type: "integer",
          description: "The auto-generated ID of the module",
        },
        title: {
          type: "string",
          description: "The title of the module",
        },
        lessons: {
          type: "array",
          items: {
            $ref: "#/components/schemas/Lesson",
          },
        },
      },
      example: {
        title: "HTML Basics",
        lessons: [
          {
            title: "Introduction to HTML",
            description: "Learn the basics of HTML structure and elements.",
            topics: ["HTML tags", "Document structure"],
            content: [
              {
                type: "text",
                data: "HTML is the standard markup language for creating web pages.",
              },
              {
                type: "video",
                data: "https://example.com/intro-to-html",
              },
            ],
          },
        ],
      },
    },
    Lesson: {
      type: "object",
      required: ["title", "description", "topics", "content"],
      properties: {
        id: {
          type: "integer",
          description: "The auto-generated ID of the lesson",
        },
        title: {
          type: "string",
          description: "The title of the lesson",
        },
        description: {
          type: "string",
          description: "A brief description of the lesson",
        },
        topics: {
          type: "array",
          items: {
            type: "string",
          },
        },
        content: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["text", "video", "audio"],
              },
              data: {
                type: "string",
                description: "The content data (text, URL to video, etc.)",
              },
            },
          },
        },
      },
      example: {
        title: "Introduction to HTML",
        description: "Learn the basics of HTML structure and elements.",
        topics: ["HTML tags", "Document structure"],
        content: [
          {
            type: "text",
            data: "HTML is the standard markup language for creating web pages.",
          },
          {
            type: "video",
            data: "https://example.com/intro-to-html",
          },
        ],
      },
    },
  },
};

export default components;
