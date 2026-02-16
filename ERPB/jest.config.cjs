module.exports = {
  testEnvironment: 'node',
  roots: [ '<rootDir>/tests' ],
  clearMocks: true,
  moduleNameMapper: {
    '^@(.+)$': '<rootDir>/src/$1',
  },
};
