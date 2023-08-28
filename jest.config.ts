import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {},
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  // setupFiles: ["<rootDir>/test/jest.setup.ts"],
  // testTimeout: 60000,
};

export default config;
