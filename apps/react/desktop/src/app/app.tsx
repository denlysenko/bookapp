import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import './app.scss';

export const App = () => {
  return (
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
  );
};

export default App;
