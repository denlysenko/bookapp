// tslint:disable: no-identical-functions

// tslint:disable: no-duplicate-string

describe('Buy Books Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.contains('Buy Books').click();
  });

  it('should display list of paid books', () => {
    cy.get('[data-test=list-item]').should('have.length', 3);
  });

  it('should search a book', () => {
    cy.searchBooks('Littl');
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'Little Town on the Prairie');
  });

  it('should filter books by most recent', () => {
    cy.filterBooks('recent');
    cy.get('[data-test=list-item]')
      .first()
      .find('.title')
      .should('contain', 'The Hound of the Baskervilles');
  });

  it('should filter books by most popular', () => {
    cy.filterBooks('popular');
    cy.get('[data-test=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Little Town on the Prairie');
  });

  it('should rate a book', () => {
    cy.rateBook(1, 5);
    cy.get('.logs .mat-list-item')
      .first()
      .should('contain', 'You rated a Book');
  });

  it('should open book view page', () => {
    cy.get('[data-test=list-item]')
      .first()
      .click();

    cy.url().should('contain', 'the-hound-of-the-baskervilles');
  });
});
