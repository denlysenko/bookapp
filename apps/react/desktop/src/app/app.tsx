import { ApolloProvider } from '@apollo/client';

import { createApollo } from '@bookapp/react/graphql';

import { ThemeProvider } from '@material-ui/styles';

import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import './app.scss';
import { environment } from '../environments/environment';
import { theme } from './theme';

const client = createApollo(environment);

function Root() {
  return <div>This is the root route.</div>;
}

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Root</Link>
              </li>
            </ul>
            <header style={{ textAlign: 'center' }}>
              <h1>Welcome to react-desktop!</h1>
              <img width="450" src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" />
            </header>
            <p>
              This is a React app built with <a href="https://nx.dev">Nx</a>.
            </p>
            <p>🔎 **Nx is a set of Angular CLI power-ups for modern development.**</p>
            <h2>Quick Start & Documentation</h2>
            <ul>
              <li>
                <a href="https://nx.dev/getting-started/what-is-nx">
                  30-minute video showing all Nx features
                </a>
              </li>
              <li>
                <a href="https://nx.dev/tutorial/01-create-application">Interactive tutorial</a>
              </li>
            </ul>
            <Route path="/" element={<Root />} />
          </div>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
