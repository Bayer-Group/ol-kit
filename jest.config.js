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
  'setupFiles': [
    './jest.setup.js'
  ],
  'snapshotSerializers': [
    '<rootDir>/node_modules/enzyme-to-json/serializer'
  ],
  'cacheDirectory': '.jest',
  'coverageReporters': [
    'lcov'
  ]
}
