import { ApolloProvider } from '@apollo/client';

import { createApollo } from '@bookapp/react/graphql';

import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import { environment } from '../environments/environment';

import './app.scss';

const client = createApollo(environment);

export const App = () => {
  return (
    <ApolloProvider client={client}>
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
          <Route
            path="/"
            exact={true}
            // tslint:disable-next-line: jsx-no-lambda
            render={() => <div>This is the root route.</div>}
          />
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
