describe('Logout', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.get('#user-menu').click();
    cy.contains('Signout').click();
  });

  it('should logout and redirect to auth', () => {
    cy.url().should('include', '/auth');
  });
});
