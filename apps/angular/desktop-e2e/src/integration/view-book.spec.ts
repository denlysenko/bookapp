describe('View Book Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.get('[data-test=list-item]')
      .first()
      .click();
  });

  it('should display book details', () => {
    cy.get('[data-test=title]').should('contain', 'Pride and Prejudice');
  });

  it('should rate book', () => {
    cy.get('.rating-star').then($stars => {
      cy.wrap($stars[4]).click();
    });

    cy.get('.logs .mat-list-item')
      .should('have.length', 1)
      .and('contain', 'You rated a Book');
  });

  it('should send a comment', () => {
    cy.get('[data-test=comment]').type('A short comment');
    cy.get('[data-test=submit-comment]').click();
    cy.get('.comments .mat-list-item').should('have.length', 1);
    cy.get('.logs .mat-list-item')
      .should('have.length', 1)
      .and('contain', 'You commented a Book');
  });

  it('should add book to favorites', () => {
    cy.get('[data-test=favorites]').click();
    cy.get('.logs .mat-list-item')
      .should('have.length', 1)
      .and('contain', 'You added a Book to Favourites');

    cy.contains('Favorite').click();
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'Pride and Prejudice');
  });

  it('should remove book from favorites', () => {
    // first add to favorites
    cy.get('[data-test=favorites]').click();
    cy.get('[data-test=favorites]').click();
    cy.get('.logs .mat-list-item')
      .first()
      .should('contain', 'You removed a Book from Favourites');

    cy.contains('Favorite').click();
    cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should add book to mustread', () => {
    cy.get('[data-test=mustread]').click();
    cy.get('.logs .mat-list-item')
      .should('have.length', 1)
      .and('contain', 'You added a Book to Must Read Titles');

    cy.contains('Must Read Titles').click();
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'Pride and Prejudice');
  });

  it('should remove book from mustread', () => {
    // first add to mustread
    cy.get('[data-test=mustread]').click();
    cy.get('[data-test=mustread]').click();
    cy.get('.logs .mat-list-item')
      .first()
      .should('contain', 'You removed a Book from Must Read Titles');

    cy.contains('Must Read Titles').click();
    cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should add book to wishlist', () => {
    cy.contains('Buy Books').click();
    cy.get('[data-test=list-item]')
      .first()
      .click();

    cy.get('[data-test=wishlist]').click();
    cy.get('.logs .mat-list-item')
      .first()
      .should('contain', 'You added a Book to Wishlist');

    cy.contains('Wishlist').click();
    cy.get('[data-test=list-item]')
      .should('have.length', 1)
      .and('contain', 'The Hound of the Baskervilles');
  });

  it('should remove book from wishlist', () => {
    cy.contains('Buy Books').click();
    cy.get('[data-test=list-item]')
      .first()
      .click();

    // first add to wishlist
    cy.get('[data-test=wishlist]').click();
    cy.get('[data-test=wishlist]').click();
    cy.get('.logs .mat-list-item')
      .first()
      .should('contain', 'You removed a Book from Wishlist');

    cy.contains('Wishlist').click();
    cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should open books reader', () => {
    cy.get('[data-test=read]').click();

    cy.url().should('include', '/books/read');
  });
});
