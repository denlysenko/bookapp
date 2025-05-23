describe('Browse Books Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
  });

  it('should display list of free books', () => {
    cy.get('[data-testid=list-item]').should('have.length', 4);
  });

  it('should search a book', () => {
    cy.searchBooks('Twelv');
    cy.get('[data-testid=list-item]').should('have.length', 1).and('contain', 'Twelve Men');
  });

  it('should filter books by all', () => {
    cy.filterBooks('all');
    cy.get('[data-testid=list-item]').first().find('.title').should('contain', 'Treasure Island');
  });

  it('should filter books by most popular', () => {
    cy.filterBooks('popular');
    cy.get('[data-testid=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Tender is the Night');
  });

  it('should rate a book', () => {
    cy.rateBook(1, 5);
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You rated a Book');
  });

  it('should open book view page', () => {
    cy.get('[data-testid=list-item]').first().click();
    cy.url().should('contain', 'pride-and-prejudice');
  });
});
