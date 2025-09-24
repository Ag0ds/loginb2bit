const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/e2e/'],
};

module.exports = createJestConfig(customJestConfig);
