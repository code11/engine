module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.[t|j]s?$": "ts-jest",
  },
  rootDir: "./",
  moduleFileExtensions: ["ts", "js", "json"],
  testRegex: "(/(src|specs)/.*(\\.|/)(test|spec))\\.(ts|js)?$",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "packages/*/src/**/*.{ts,js}",
    "!packages/**/src/*.d.ts",
  ],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json", //from inside the package
    },
  },
  coverageThreshold: {
    global: {
      lines: 0,
      statements: 0,
      functions: 0,
      branches: 0,
    },
  },
};
