describe('Passkeys', () => {
  const addBtn = '[data-testid=add]';
  const editBtn = '[data-testid=edit]';
  const deleteBtn = '[data-testid=delete]';
  const labelInput = '[name=label]';
  const loginMenuBtn = '[data-testid=login-menu]';
  const loginWithPasskeyBtn = '[data-testid=login-passkey]';

  before(() => {
    cy.task('seedDatabase');
    cy.addVirtualAuthenticator().as('authenticatorId');
  });

  describe('Create passkey', () => {
    beforeEach(function () {
      cy.wrap(this['authenticatorId']).as('authenticatorId');
      cy.login('user@test.com', 'password');
      cy.intercept('POST', '/graphql?getPasskeys').as('getPasskeys');
      cy.intercept('POST', '/graphql?generateRegistrationOptions').as(
        'generateRegistrationOptions'
      );
      cy.intercept('POST', '/graphql?verifyRegistrationResponse', (request) => {
        request.headers['origin'] = 'http://localhost:4301';
      }).as('verifyRegistrationResponse');
      cy.get('#user-menu').click();
      cy.contains('Passkeys').click();
    });

    it('should create a passkey', () => {
      cy.wait('@getPasskeys');
      cy.get(editBtn).should('have.length', 0);
      cy.get(addBtn).click();
      cy.wait('@generateRegistrationOptions');
      cy.get<string>('@authenticatorId').then((authenticatorId) => {
        cy.simulateSuccessfulPasskeyInput(authenticatorId);
        cy.wait('@verifyRegistrationResponse');
        cy.get(editBtn).should('have.length', 1);
        cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Passkey created');
      });
    });
  });

  describe('Edit passkey', () => {
    beforeEach(function () {
      cy.wrap(this['authenticatorId']).as('authenticatorId');
      cy.intercept('POST', '/graphql?getPasskeys').as('getPasskeys');
      cy.login('user@test.com', 'password');
      cy.get('#user-menu').click();
      cy.contains('Passkeys').click();
    });

    it('should update passkey label', () => {
      cy.wait('@getPasskeys');
      cy.contains('Passkey #1').should('exist');
      cy.get(editBtn).click();
      cy.get(labelInput).clear().type('New Label');
      cy.get('[data-testid=save]').click();
      cy.contains('Passkey #1').should('not.exist');
      cy.contains('New Label').should('exist');
      cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Passkey updated');
    });
  });

  describe('Sign in with passkey', () => {
    beforeEach(function () {
      cy.wrap(this['authenticatorId']).as('authenticatorId');
      cy.visit('/auth');
      cy.intercept('POST', '/graphql?generateAuthenticationOptions').as(
        'generateAuthenticationOptions'
      );
      cy.intercept('POST', '/graphql?verifyAuthenticationResponse', (request) => {
        request.headers['origin'] = 'http://localhost:4301';
      }).as('verifyAuthenticationResponse');
    });

    it('should sign in with passkey', () => {
      cy.get(loginMenuBtn).click();
      cy.get(loginWithPasskeyBtn).click();
      cy.wait('@generateAuthenticationOptions');

      cy.get<string>('@authenticatorId').then((authenticatorId) => {
        cy.simulateSuccessfulPasskeyInput(authenticatorId);
        cy.wait('@verifyAuthenticationResponse');
        cy.url().should('include', '/books/browse');
      });
    });
  });

  describe('Delete passkey', () => {
    beforeEach(function () {
      cy.wrap(this['authenticatorId']).as('authenticatorId');
      cy.intercept('POST', '/graphql?getPasskeys').as('getPasskeys');
      cy.login('user@test.com', 'password');
      cy.get('#user-menu').click();
      cy.contains('Passkeys').click();
    });

    it('should delete passkey', () => {
      cy.wait('@getPasskeys');
      cy.get(deleteBtn).click();
      cy.get('[data-testid=confirm]').click();
      cy.get(deleteBtn).should('have.length', 0);
      cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Passkey deleted');
    });
  });
});
