describe('Browse Books Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.intercept('POST', '/graphql?freeBooks').as('freeBooks');
  });

  it('should display list of free books', () => {
    cy.get('[data-test=list-item]').should('have.length', 4);
  });

  it('should search a book', () => {
    cy.searchBooks('Twelv');
    cy.wait('@freeBooks');
    cy.get('[data-test=list-item]').should('have.length', 1).and('contain', 'Twelve Men');
  });

  it('should filter books by all', () => {
    cy.filterBooks('all');
    cy.wait('@freeBooks');
    cy.get('[data-test=list-item]').first().find('.title').should('contain', 'Treasure Island');
  });

  it('should filter books by most popular', () => {
    cy.filterBooks('popular');
    cy.wait('@freeBooks');
    cy.get('[data-test=list-item]').first().find('.title').should('contain', 'Tender is the Night');
  });

  it('should rate a book', () => {
    cy.intercept('POST', '/graphql?rateBook').as('rateBook');
    cy.rateBook(3, 5);
    cy.wait('@rateBook');
    cy.get('.logs .mat-mdc-list-item').first().should('contain', 'You rated a Book');
  });

  it('should open book view page', () => {
    cy.intercept('POST', '/graphql?book').as('book');
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@book');
    cy.url().should('contain', 'pride-and-prejudice');
  });
});
