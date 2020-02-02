declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable;
    uploadOnServer(response: any): Chainable;
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

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
