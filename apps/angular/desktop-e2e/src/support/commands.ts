// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadOnServer(response: any): Chainable;
    searchBooks(query: string): Chainable;
    filterBooks(filter: 'all' | 'recent' | 'popular'): Chainable;
    rateBook(bookIndex: number, rate: number): Chainable;
    addVirtualAuthenticator(): Chainable;
    simulateSuccessfulPasskeyInput(authenticatorId: string): Chainable;
  }
}

// login through the UI because the token is stored in the application memory,
// and I could not find a way to access the ng service, which stores the token in memory
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth');
  cy.get('[data-test=email]').type(email);
  cy.get('[data-test=password]').type(password).type('{enter}');
});

Cypress.Commands.add('uploadOnServer', (response) => {
  cy.intercept('POST', 'http://localhost:3000/files', response);
});

Cypress.Commands.add('searchBooks', (query) => {
  cy.get('[data-test=search-book]').type(query);
});

Cypress.Commands.add('filterBooks', (filter) => {
  cy.get(`[data-test=${filter}]`).click();
});

Cypress.Commands.add('rateBook', (bookIndex, rate) => {
  cy.get('[data-test=list-item]').then(($books) => {
    cy.wrap($books[bookIndex])
      .find('.rating-star')
      .then(($stars) => {
        cy.wrap($stars[rate - 1]).click();
      });
  });
});

Cypress.Commands.add('addVirtualAuthenticator', () => {
  return cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'WebAuthn.disable',
      params: {},
    })
      .then(() => {
        return Cypress.automation('remote:debugger:protocol', {
          command: 'WebAuthn.enable',
          params: {},
        });
      })
      .then(() => {
        return Cypress.automation('remote:debugger:protocol', {
          command: 'WebAuthn.addVirtualAuthenticator',
          params: {
            options: {
              protocol: 'ctap2',
              transport: 'internal',
              hasResidentKey: true,
              hasUserVerification: true,
              isUserVerified: true,
              automaticPresenceSimulation: true,
            },
          },
        });
      })
      .then((result) => {
        return result.authenticatorId;
      })
  );
});

Cypress.Commands.add('simulateSuccessfulPasskeyInput', (authenticatorId) => {
  cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'WebAuthn.setUserVerified',
      params: {
        authenticatorId,
        isUserVerified: true,
      },
    }).then(() => {
      return Cypress.automation('remote:debugger:protocol', {
        command: 'WebAuthn.setAutomaticPresenceSimulation',
        params: {
          authenticatorId,
          enabled: true,
        },
      });
    })
  );
});
