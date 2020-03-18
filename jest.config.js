module.exports = {
  'testEnvironment': 'jest-environment-jsdom-global',
  'verbose': true,
  'unmockedModulePathPatterns': [
    '<rootDir>/node_modules/react/',
    '<rootDir>/node_modules/react-dom/',
    '<rootDir>/node_modules/ol/'
  ],
  'transform': {
    '^.+\\.jsx?$': 'babel-jest'
  },
  'transformIgnorePatterns': [
    '/node_modules/(?!ol)'
  ],
  'testPathIgnorePatterns': [
    'node_modules',
    'core'
  ],
  'setupFilesAfterEnv': [
    '<rootDir>/jest.setup.js',
    'jest-canvas-mock'
  ],
  'snapshotSerializers': [
    '<rootDir>/node_modules/enzyme-to-json/serializer'
  ],
  'cacheDirectory': '.jest',
  'coverageReporters': [
    'lcov'
  ]
}
