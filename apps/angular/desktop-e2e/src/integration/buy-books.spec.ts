// tslint:disable: no-identical-functions

// tslint:disable: no-duplicate-string

describe('Buy Books Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.intercept('POST', '/graphql?paidBooks').as('paidBooks');
    cy.contains('Buy Books').click();
  });

  it('should display list of paid books', () => {
    cy.get('[data-test=list-item]').should('have.length', 3);
  });

  it('should search a book', () => {
    cy.searchBooks('Littl');
    cy.wait('@paidBooks');
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'Little Town on the Prairie');
  });

  it('should filter books by all', () => {
    cy.filterBooks('all');
    cy.wait('@paidBooks');
    cy.get('[data-test=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Little Town on the Prairie');
  });

  it('should filter books by most popular', () => {
    cy.filterBooks('popular');
    cy.wait('@paidBooks');
    cy.get('[data-test=list-item]')
      .first()
      .find('.title')
      .should('contain', 'Little Town on the Prairie');
  });

  it('should rate a book', () => {
    cy.intercept('POST', '/graphql?rateBook').as('rateBook');
    cy.rateBook(1, 5);
    cy.wait('@rateBook');
    cy.get('.logs .mat-list-item').first().should('contain', 'You rated a Book');
  });

  it('should open book view page', () => {
    cy.intercept('POST', '/graphql?book').as('book');
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@book');
    cy.url().should('contain', 'the-hound-of-the-baskervilles');
  });
});
