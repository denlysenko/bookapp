module.exports = {
  name: 'react-pages-auth',
  preset: '../../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { cwd: __dirname, configFile: './babel-jest.config.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/react/pages/auth',
};
