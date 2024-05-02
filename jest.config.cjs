module.exports = {
  setupFilesAfterEnv: [
    "<rootDir>/jest/setupTests.js",
    "<rootDir>/node_modules/@testing-library/jest-dom",
  ],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
};
