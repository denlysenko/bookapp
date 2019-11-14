module.exports = {
  name: 'angular-desktop-history',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/angular/desktop/history',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
