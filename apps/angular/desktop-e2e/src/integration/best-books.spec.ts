describe('Buy Books Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.contains('List of the Best').click();
  });

  it('should display list of the best books', () => {
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'Treasure Island');
  });
});
