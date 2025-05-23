describe('View Book Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.intercept('POST', '/graphql?addToBookmarks').as('addToBookmarks');
    cy.intercept('POST', '/graphql?removeFromBookmarks').as('removeFromBookmarks');
    cy.intercept('POST', '/graphql?bookmarksByUserAndBook').as('bookmarksByUserAndBook');
  });

  it('should display book details', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.get('h3[data-test=title]').should('contain', 'Pride and Prejudice');
  });

  it('should rate book', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.intercept('POST', '/graphql?rateBook').as('rateBook');
    cy.get('.rating-star').then(($stars) => {
      cy.wrap($stars[4]).click();
    });
    cy.wait('@rateBook');
    cy.get('.logs .mat-mdc-list-item').first().should('contain', 'You rated a Book');
  });

  it('should send a comment', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.intercept('POST', '/graphql?addComment').as('addComment');
    cy.get('[data-test=comment]').type('A short comment');
    cy.get('[data-test=submit-comment]').click();
    cy.wait('@addComment');
    cy.get('.logs .mat-mdc-list-item').first().should('contain', 'You commented a Book');
  });

  it('should add book to favorites', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@bookmarksByUserAndBook');
    cy.get('[data-test=favorites]').click();
    cy.wait('@addToBookmarks');
    cy.get('.logs .mat-mdc-list-item').first().should('contain', 'You added a Book to Favourites');

    cy.contains('Favorite').click();
    cy.get('[data-test=list-item]').should('have.length', 1).and('contain', 'Pride and Prejudice');
  });

  it('should remove book from favorites', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@bookmarksByUserAndBook');
    cy.get('[data-test=favorites]').click();
    cy.wait('@removeFromBookmarks');
    cy.get('.logs .mat-mdc-list-item')
      .first()
      .should('contain', 'You removed a Book from Favourites');

    cy.contains('Favorite').click();
    cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should add book to mustread', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@bookmarksByUserAndBook');
    cy.get('[data-test=mustread]').click();
    cy.wait('@addToBookmarks');
    cy.get('.logs .mat-mdc-list-item')
      .first()
      .should('contain', 'You added a Book to Must Read Titles');

    cy.contains('Must Read Titles').click();
    cy.get('[data-test=list-item]').should('have.length', 1).and('contain', 'Pride and Prejudice');
  });

  it('should remove book from mustread', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@bookmarksByUserAndBook');
    cy.get('[data-test=mustread]').click();
    cy.wait('@removeFromBookmarks');
    cy.get('.logs .mat-mdc-list-item')
      .first()
      .should('contain', 'You removed a Book from Must Read Titles');

    cy.contains('Must Read Titles').click();
    cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should add book to wishlist', () => {
    cy.intercept('POST', '/graphql?paidBooks').as('paidBooks');
    cy.contains('Buy Books').click();
    cy.wait('@paidBooks');
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@bookmarksByUserAndBook');
    cy.get('[data-test=wishlist]').click();
    cy.wait('@addToBookmarks');
    cy.get('.logs .mat-mdc-list-item').first().should('contain', 'You added a Book to Wishlist');

    cy.contains('Wishlist').click();
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'The Hound of the Baskervilles');
  });

  it('should remove book from wishlist', () => {
    cy.intercept('POST', '/graphql?paidBooks').as('paidBooks');
    cy.contains('Buy Books').click();
    cy.wait('@paidBooks');
    cy.get('[data-test=list-item]').first().click();
    cy.wait('@bookmarksByUserAndBook');
    cy.get('[data-test=wishlist]').click();
    cy.wait('@removeFromBookmarks');
    cy.get('.logs .mat-mdc-list-item')
      .first()
      .should('contain', 'You removed a Book from Wishlist');

    cy.contains('Wishlist').click();
    cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should open book reader', () => {
    cy.get('[data-test=list-item]').first().click();
    cy.get('[data-test=read]').click();

    cy.url().should('include', '/books/read');
  });
});
