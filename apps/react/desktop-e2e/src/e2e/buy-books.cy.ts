describe('Buy Books Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.contains('Buy Books').click();
  });

  it('should display list of paid books', () => {
    cy.get('[data-testid=list-item]').should('have.length', 3);
  });

  it('should search a book', () => {
    cy.searchBooks('Littl');
    cy.get('[data-testid=list-item]')
      .should('have.length', 1)
      .and('contain', 'Little Town on the Prairie');
  });

  it('should filter books by all', () => {
    cy.filterBooks('all');
    cy.get('[data-testid=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Little Town on the Prairie');
  });

  it('should filter books by most popular', () => {
    cy.filterBooks('popular');
    cy.get('[data-testid=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Little Town on the Prairie');
  });

  it('should rate a book', () => {
    cy.rateBook(1, 5);
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You rated a Book');
  });

  it('should open book view page', () => {
    cy.get('[data-testid=list-item]').first().click();
    cy.url().should('contain', 'the-hound-of-the-baskervilles');
  });
});
