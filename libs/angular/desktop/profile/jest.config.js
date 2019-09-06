module.exports = {
  name: 'angular-desktop-profile',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/angular/desktop/profile',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
