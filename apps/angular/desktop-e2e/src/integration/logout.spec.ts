describe('Logout', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.get('#user-menu-toggler').click();
    cy.contains('Signout').click();
  });

  it('should logout and redirect to auth', () => {
    cy.url().should('include', '/auth');
  });
});
