module.exports = {
  name: 'angular-desktop-books-view-book',
  preset: '../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../coverage/libs/angular/desktop/books/view-book',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
