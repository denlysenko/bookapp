module.exports = {
  name: 'angular-desktop',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/angular/desktop',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
