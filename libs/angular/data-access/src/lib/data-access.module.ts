import { NgModule } from '@angular/core';

import { EditBookResolver } from './resolvers/edit-book.resolver';
import { ReadBookResolver } from './resolvers/read-book.resolver';
import { AuthService } from './services/auth/auth.service';
import { BookmarksService } from './services/bookmarks/bookmarks.service';
import { BooksService } from './services/books/books.service';
import { PasswordService } from './services/password/password.service';
import { ProfileService } from './services/profile/profile.service';

@NgModule({
  providers: [
    AuthService,
    PasswordService,
    ProfileService,
    BooksService,
    BookmarksService,
    ReadBookResolver,
    EditBookResolver,
  ],
})
export class DataAccessModule {}
