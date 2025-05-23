import { lazy, Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { ApolloProvider } from '@apollo/client';

import { ThemeProvider } from '@mui/material/styles';

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
  import('@bookapp/react/pages/password').then(({ Password }) => ({
    default: Password,
  }))
);

const Profile = lazy(() =>
  import('@bookapp/react/pages/profile').then(({ Profile }) => ({
    default: Profile,
  }))
);

const AddBook = lazy(() =>
  import('@bookapp/react/pages/books/add-book').then(({ AddBook }) => ({
    default: AddBook,
  }))
);

const BrowseBooks = lazy(() =>
  import('@bookapp/react/pages/books/browse-books').then(({ BrowseBooks }) => ({
    default: BrowseBooks,
  }))
);

const BuyBooks = lazy(() =>
  import('@bookapp/react/pages/books/buy-books').then(({ BuyBooks }) => ({
    default: BuyBooks,
  }))
);

const ViewBook = lazy(() =>
  import('@bookapp/react/pages/books/view-book').then(({ ViewBook }) => ({
    default: ViewBook,
  }))
);

const Bookmarks = lazy(() =>
  import('@bookapp/react/pages/bookmarks').then(({ Bookmarks }) => ({
    default: Bookmarks,
  }))
);

const BestBooks = lazy(() =>
  import('@bookapp/react/pages/books/best-books').then(({ BestBooks }) => ({
    default: BestBooks,
  }))
);

const ReadBook = lazy(() =>
  import('@bookapp/react/pages/books/read-book').then(({ ReadBook }) => ({
    default: ReadBook,
  }))
);

const History = lazy(() =>
  import('@bookapp/react/pages/history').then(({ History }) => ({
    default: History,
  }))
);

const App = () => {
  const { showFeedback } = useFeedback();
  const client = createApollo(showFeedback);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<FullPageSpinner />}>
          <Router>
            <Routes>
              <Route
                path="/auth"
                element={
                  <AnonymousGuard>
                    <Auth />
                  </AnonymousGuard>
                }
              />
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <Main />
                  </AuthGuard>
                }
              >
                <Route path="" element={<Navigate to="/books/browse" />} />
                <Route path="password" element={<Password />} />
                <Route path="profile" element={<Profile />} />
                <Route path="history" element={<History />} />
                <Route
                  path="books/add"
                  element={
                    <RolesGuard roles={[ROLES.ADMIN]}>
                      <AddBook />
                    </RolesGuard>
                  }
                />
                <Route
                  path="books/add/:author/:slug"
                  element={
                    <RolesGuard roles={[ROLES.ADMIN]}>
                      <AddBook />
                    </RolesGuard>
                  }
                />
                <Route path="books/browse" element={<BrowseBooks />} />
                <Route path="books/browse/:author/:slug" element={<ViewBook />} />
                <Route path="books/buy" element={<BuyBooks />} />
                <Route path="books/buy/:author/:slug" element={<ViewBook />} />
                <Route path="books/read" element={<ReadBook />} />
                <Route path="books/read/:author/:slug" element={<ReadBook />} />
                <Route path="books/best" element={<BestBooks />} />
                <Route
                  path="bookmarks/favorites"
                  element={<Bookmarks title="Favorite Books" type={BOOKMARKS.FAVORITES} />}
                />
                <Route
                  path="bookmarks/mustread"
                  element={<Bookmarks title="Must Read Titles" type={BOOKMARKS.MUSTREAD} />}
                />
                <Route
                  path="bookmarks/wishlist"
                  element={<Bookmarks title="Wishlist" type={BOOKMARKS.WISHLIST} />}
                />
              </Route>
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
