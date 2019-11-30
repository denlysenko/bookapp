module.exports = {
  name: 'angular-desktop-books-best-books',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/angular/desktop/books/best-books',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
