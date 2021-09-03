module.exports = {
  preset: "ts-jest",
  testMatch: ["**/__test__/*.+(ts|js)"],
  moduleFileExtensions: ["ts", "js"],
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "./__test__/tsconfig.jest.json",
    },
  },
};
