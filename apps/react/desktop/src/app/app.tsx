import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import { ApolloProvider } from '@apollo/client';

import { ThemeProvider } from '@material-ui/styles';

import { useRefreshToken } from '@bookapp/react/core';
import { createApollo } from '@bookapp/react/graphql';
import { AnonymousGuard, AuthGuard, RolesGuard } from '@bookapp/react/guards';
import { Auth } from '@bookapp/react/pages/auth';
import { Main } from '@bookapp/react/pages/main';
import { FeedbackProvider, FullPageSpinner, useFeedback } from '@bookapp/react/ui';
import { BOOKMARKS, ROLES } from '@bookapp/shared/enums';

import './app.scss';
import { theme } from './theme';

const Password = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/password').then(({ Password }) => ({
    default: Password,
  }))
);

const Profile = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/profile').then(({ Profile }) => ({
    default: Profile,
  }))
);

const AddBook = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/books/add-book').then(({ AddBook }) => ({
    default: AddBook,
  }))
);

const BrowseBooks = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/books/browse-books').then(({ BrowseBooks }) => ({
    default: BrowseBooks,
  }))
);

const BuyBooks = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/books/buy-books').then(({ BuyBooks }) => ({
    default: BuyBooks,
  }))
);

const ViewBook = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/books/view-book').then(({ ViewBook }) => ({
    default: ViewBook,
  }))
);

const Bookmarks = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/bookmarks').then(({ Bookmarks }) => ({
    default: Bookmarks,
  }))
);

const BestBooks = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/books/best-books').then(({ BestBooks }) => ({
    default: BestBooks,
  }))
);

const App = () => {
  console.log('App rendered');

  const { showFeedback } = useFeedback();
  const client = createApollo(showFeedback);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<FullPageSpinner />}>
          <Router>
            <Routes>
              <AnonymousGuard path="/auth" element={<Auth />} />
              <AuthGuard path="/" element={<Main />}>
                <Route path="" element={<Navigate to="/books/browse" />} />
                <AuthGuard path="password" element={<Password />} />
                <AuthGuard path="profile" element={<Profile />} />
                <RolesGuard path="books/add" element={<AddBook />} roles={[ROLES.ADMIN]} />
                <RolesGuard
                  path="books/add/:author/:slug"
                  element={<AddBook />}
                  roles={[ROLES.ADMIN]}
                />
                <AuthGuard path="books/browse" element={<BrowseBooks />} />
                <AuthGuard path="books/browse/:author/:slug" element={<ViewBook />} />
                <AuthGuard path="books/buy" element={<BuyBooks />} />
                <AuthGuard path="books/best" element={<BestBooks />} />
                <AuthGuard path="books/buy/:author/:slug" element={<ViewBook />} />
                <AuthGuard
                  path="bookmarks/favorites"
                  element={<Bookmarks title="Favorite Books" type={BOOKMARKS.FAVORITES} />}
                />
                <AuthGuard
                  path="bookmarks/mustread"
                  element={<Bookmarks title="Must Read Titles" type={BOOKMARKS.MUSTREAD} />}
                />
                <AuthGuard
                  path="bookmarks/wishlist"
                  element={<Bookmarks title="Wishlist" type={BOOKMARKS.WISHLIST} />}
                />
              </AuthGuard>
            </Routes>
          </Router>
        </Suspense>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default () => {
  // using this hook here instead of App component to avoid recreation of Apollo client on re-render
  const { refreshing } = useRefreshToken();

  if (refreshing) {
    return <FullPageSpinner />;
  }

  return (
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  );
};
