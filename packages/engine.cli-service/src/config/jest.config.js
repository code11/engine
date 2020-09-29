module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  rootDir: "./",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: "(.*(\\.|/)(test|tests|spec))\\.(ts|js)x?$",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!packages/**/src/*.d.ts"],
  coverageThreshold: {
    global: {
      lines: 0,
      statements: 0,
      functions: 0,
      branches: 0,
    },
  },
};
