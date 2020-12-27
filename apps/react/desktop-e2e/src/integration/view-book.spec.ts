// tslint:disable: no-identical-functions

// tslint:disable: no-duplicate-string
describe('View Book Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.get('[data-testid=list-item]').first().click();
  });

  it('should display book details', () => {
    cy.get('h3[data-testid=title]').should('contain', 'Pride and Prejudice');
  });

  it('should rate a book', () => {
    const rate = 5;
    cy.get('.MuiRating-label').then(($stars) => {
      cy.wrap($stars[rate - 1]).click();
    });
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You rated a Book');
  });

  it('should send a comment', () => {
    cy.get('[data-testid=comment-input]').type('A short comment');
    cy.get('[data-testid=submit-comment]').click();
    cy.get('[data-testid=comment]').should('have.length', 1);
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You commented a Book');
  });

  it('should add book to favorites', () => {
    cy.get('[data-testid=favorites]').click();
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You added a Book to Favourites');

    // TODO: test it later
    // cy.contains('Favorite').click();
    // cy.get('[data-test=list-item]').should('have.length', 1).and('contain', 'Pride and Prejudice');
  });

  it('should remove book from favorites', () => {
    // first add to favorites
    cy.get('[data-testid=favorites]').click();
    cy.get('[data-testid=favorites]').click();
    cy.get('.logs .MuiListItem-root')
      .first()
      .should('contain', 'You removed a Book from Favourites');

    // TODO: test it later
    // cy.contains('Favorite').click();
    // cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should add book to mustread', () => {
    cy.get('[data-testid=mustread]').click();
    cy.get('.logs .MuiListItem-root')
      .first()
      .should('contain', 'You added a Book to Must Read Titles');

    // TODO: test it later
    // cy.contains('Must Read Titles').click();
    // cy.get('[data-test=list-item]').should('have.length', 1).and('contain', 'Pride and Prejudice');
  });

  it('should remove book from mustread', () => {
    // first add to mustread
    cy.get('[data-testid=mustread]').click();
    cy.get('[data-testid=mustread]').click();
    cy.get('.logs .MuiListItem-root')
      .first()
      .should('contain', 'You removed a Book from Must Read Titles');

    // TODO: test it later
    // cy.contains('Must Read Titles').click();
    // cy.get('[data-test=list-item]').should('not.exist');
  });

  it('should add book to wishlist', () => {
    cy.contains('Buy Books').click();
    cy.get('[data-testid=list-item]').first().click();

    cy.get('[data-testid=wishlist]').click();
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You added a Book to Wishlist');

    // TODO: test it later
    // cy.contains('Wishlist').click();
    // cy.get('[data-test=list-item]')
    //   .should('have.length', 1)
    //   .and('contain', 'The Hound of the Baskervilles');
  });

  it('should remove book from wishlist', () => {
    cy.contains('Buy Books').click();
    cy.get('[data-testid=list-item]').first().click();

    // first add to wishlist
    cy.get('[data-testid=wishlist]').click();
    cy.get('[data-testid=wishlist]').click();
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You removed a Book from Wishlist');

    // TODO: test it later
    // cy.contains('Wishlist').click();
    // cy.get('[data-test=list-item]').should('not.exist');
  });

  // TODO: test it later
  // it('should open book reader', () => {
  //   cy.get('[data-test=read]').click();

  //   cy.url().should('include', '/books/read');
  // });
});
