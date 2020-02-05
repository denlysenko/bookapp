declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable;
    uploadOnServer(response: any): Chainable;
    searchBooks(query: string): Chainable;
    filterBooks(filter: 'all' | 'recent' | 'popular'): Chainable;
    rateBook(bookIndex: number, rate: number): Chainable;
  }
}

// login through the UI because the token is stored in the application memory,
// and I could not find a way to access the ng service, which stores the token in memory
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth');
  cy.get('[data-test=email]').type(email);
  cy.get('[data-test=password]')
    .type(password)
    .type('{enter}');
});

Cypress.Commands.add('uploadOnServer', response => {
  cy.server();
  cy.route('POST', 'http://localhost:3333/files', response);
});

Cypress.Commands.add('searchBooks', query => {
  cy.get('[data-test=search-book]').type(query);
});

Cypress.Commands.add('filterBooks', filter => {
  cy.get(`[data-test=${filter}]`).click();
});

Cypress.Commands.add('rateBook', (bookIndex, rate) => {
  cy.get('[data-test=list-item]').then($books => {
    cy.wrap($books[bookIndex])
      .find('.rating-star')
      .then($stars => {
        cy.wrap($stars[rate - 1]).click();
      });
  });
});
