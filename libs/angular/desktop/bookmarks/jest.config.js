module.exports = {
  name: 'angular-desktop-bookmarks',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/angular/desktop/bookmarks',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
