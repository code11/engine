module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  rootDir: "./",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: "(/(src|specs)/.*(\\.|/)(test|spec))\\.(ts|js)x?$",
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      lines: 0,
      statements: 0,
      functions: 0,
      branches: 0,
    },
  },
  setupFiles: ["<rootDir>/jest.setup.js"],
};
