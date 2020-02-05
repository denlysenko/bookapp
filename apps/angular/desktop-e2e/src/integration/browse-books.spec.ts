describe('Browse Books Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
  });

  it('should display list of free books', () => {
    cy.get('[data-test=list-item]').should('have.length', 4);
  });

  it('should search a book', () => {
    cy.searchBooks('Twelv');
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'Twelve Men');
  });

  it('should filter books by most recent', () => {
    cy.filterBooks('recent');
    cy.get('[data-test=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Pride and Prejudice');
  });

  it('should filter books by most popular', () => {
    cy.filterBooks('popular');
    cy.get('[data-test=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Tender is the Night');
  });

  it('should rate a book', () => {
    cy.rateBook(3, 5);
  });

  it('should open book view page', () => {
    cy.get('[data-test=list-item]')
      .first()
      .click();

    cy.url().should('contain', 'pride-and-prejudice');
  });
});
