import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';

import { ApolloProvider } from '@apollo/client';
import { useRefreshToken } from '@bookapp/react/core';
import { createApollo } from '@bookapp/react/graphql';
import { AnonymousGuard, AuthGuard } from '@bookapp/react/guards';
import { Auth } from '@bookapp/react/pages/auth';
import { Main } from '@bookapp/react/pages/main';
import { FeedbackProvider, FullPageSpinner, useFeedback } from '@bookapp/react/ui';

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
                <AuthGuard path="password" element={<Password />} />
                <AuthGuard path="profile" element={<Profile />} />
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
