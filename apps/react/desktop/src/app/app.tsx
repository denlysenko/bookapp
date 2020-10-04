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

import { environment } from '../environments/environment';
import './app.scss';
import { theme } from './theme';

const Password = lazy(() =>
  // tslint:disable-next-line: no-shadowed-variable
  import('@bookapp/react/pages/password').then(({ Password }) => ({
    default: Password,
  }))
);

const App = () => {
  console.log('App rendered');

  const { showFeedback } = useFeedback();
  const client = createApollo(environment, showFeedback);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<FullPageSpinner />}>
          <Router>
            <Routes>
              <AnonymousGuard path="/auth" element={<Auth />} />
              <AuthGuard path="/" element={<Main />}>
                <AuthGuard path="password" element={<Password />} />
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
  const { refreshing } = useRefreshToken(environment.refreshTokenUrl);

  if (refreshing) {
    return <FullPageSpinner />;
  }

  return (
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  );
};
