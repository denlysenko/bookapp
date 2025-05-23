describe('Best Books Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.intercept('POST', '/graphql?bestBooks').as('bestBooks');
    cy.contains('List of the Best').click();
  });

  it('should display list of the best books', () => {
    cy.wait('@bestBooks');
    cy.get('[data-test=list-item]').should('have.length', 1).and('contain', 'Treasure Island');
  });
});
