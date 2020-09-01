describe('Best Books Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.server().route('POST', '/graphql?bestBooks').as('bestBooks');
    cy.contains('List of the Best').click();
  });

  it('should display list of the best books', () => {
    cy.wait('@bestBooks');
    cy.get('[data-test=list-item]').should('have.length', 1).and('contain', 'Treasure Island');
  });
});
