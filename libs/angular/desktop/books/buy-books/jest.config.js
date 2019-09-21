module.exports = {
  name: 'angular-desktop-books-buy-books',
  preset: '../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../coverage/libs/angular/desktop/books/buy-books',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
