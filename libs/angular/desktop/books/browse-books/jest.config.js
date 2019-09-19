module.exports = {
  name: 'angular-desktop-books-browse-books',
  preset: '../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../coverage/libs/angular/desktop/books/browse-books',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
