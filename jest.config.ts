module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  verbose: true,
  roots: ["<rootDir>/src/"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
