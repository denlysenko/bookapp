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
import { ROLES } from '@bookapp/shared/enums';

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
                <AuthGuard path="books/buy" element={<BuyBooks />} />
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
