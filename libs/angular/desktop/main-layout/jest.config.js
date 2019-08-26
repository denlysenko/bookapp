module.exports = {
  name: 'angular-desktop-main-layout',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/angular/desktop/main-layout',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
