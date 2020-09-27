import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';

import { ApolloProvider } from '@apollo/client';
import { useRefreshToken } from '@bookapp/react/core';
import { createApollo } from '@bookapp/react/graphql';
import { Auth } from '@bookapp/react/pages/auth';
import { FeedbackProvider, useFeedback } from '@bookapp/react/ui';

import { environment } from '../environments/environment';
import './app.scss';
import { theme } from './theme';

const App = () => {
  console.log('App rendered');

  const { showFeedback } = useFeedback();
  const client = createApollo(environment, showFeedback);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default () => {
  // using this hook here instead of App component to avoid recreation of Apollo client on re-render
  const { refreshing } = useRefreshToken(environment.refreshTokenUrl);

  if (refreshing) {
    // TODO: use UI Loader later
    return <div>Loading...</div>;
  }

  return (
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  );
};
