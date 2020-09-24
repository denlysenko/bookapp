import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ApolloProvider } from '@apollo/client';

import { createApollo } from '@bookapp/react/graphql';
import { Auth } from '@bookapp/react/pages/auth';
import { FeedbackProvider, useFeedback } from '@bookapp/react/ui';

import { ThemeProvider } from '@material-ui/styles';

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
  return (
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  );
};
