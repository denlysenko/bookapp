module.exports = {
  name: 'angular-desktop-books-add-book',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/angular/desktop/books/add-book',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
