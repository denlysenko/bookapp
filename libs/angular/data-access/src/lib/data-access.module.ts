import { NgModule } from '@angular/core';

import { EditBookResolver } from './resolvers/edit-book.resolver';
import { ReadBookResolver } from './resolvers/read-book.resolver';
import { AuthFacade } from './services/auth/auth.facade';
import { LoginMutation } from './services/auth/LoginMutation';
import { LogoutMutation } from './services/auth/LogoutMutation';
import { MeQuery } from './services/auth/MeQuery';
import { SignupMutation } from './services/auth/SignupMutation';
import { BookmarksService } from './services/bookmarks/bookmarks.service';
import { BooksService } from './services/books/books.service';
import { LogsService } from './services/logs/logs.service';
import { PasswordService } from './services/password/password.service';
import { ProfileService } from './services/profile/profile.service';

@NgModule({
  providers: [
    LoginMutation,
    SignupMutation,
    LogoutMutation,
    MeQuery,
    AuthFacade,
    PasswordService,
    ProfileService,
    BooksService,
    BookmarksService,
    ReadBookResolver,
    EditBookResolver,
    LogsService,
  ],
})
export class DataAccessModule {}
