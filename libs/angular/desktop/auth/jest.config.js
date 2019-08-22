module.exports = {
  name: 'angular-desktop-auth',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/angular/desktop/auth',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
