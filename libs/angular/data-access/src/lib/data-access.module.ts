import { NgModule } from '@angular/core';

import { EditBookResolver } from './resolvers/edit-book.resolver';
import { ReadBookResolver } from './resolvers/read-book.resolver';
import { AuthService } from './services/auth/auth.service';
import { AddBookService } from './services/books/add-book.service';
import { BookService } from './services/books/book.service';
import { PasswordService } from './services/password/password.service';
import { ProfileService } from './services/profile/profile.service';

@NgModule({
  providers: [
    AuthService,
    AddBookService,
    BookService,
    PasswordService,
    ProfileService,
    ReadBookResolver,
    EditBookResolver,
  ],
})
export class DataAccessModule {}
