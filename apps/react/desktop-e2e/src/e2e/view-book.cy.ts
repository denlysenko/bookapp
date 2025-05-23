describe('View Book Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.get('[data-testid=list-item]').first().click();
    cy.intercept('POST', '/graphql?book').as('book');
  });

  it('should display book details', () => {
    cy.get('h3[data-testid=title]').should('contain', 'Pride and Prejudice');
  });

  it('should rate a book', () => {
    cy.wait('@book');
    const rate = 5;
    cy.get(`input[name=rating][value=${rate}]`).click({ force: true });
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

    cy.contains('Favorite').click();
    cy.get('[data-testid=list-item]')
      .should('have.length', 1)
      .and('contain', 'Pride and Prejudice');
  });

  it('should remove book from favorites', () => {
    cy.get('[data-testid=favorites]').click();
    cy.get('.logs .MuiListItem-root')
      .first()
      .should('contain', 'You removed a Book from Favourites');

    cy.contains('Favorite').click();
    cy.get('[data-testid=list-item]').should('not.exist');
  });

  it('should add book to mustread', () => {
    cy.get('[data-testid=mustread]').click();
    cy.get('.logs .MuiListItem-root')
      .first()
      .should('contain', 'You added a Book to Must Read Titles');

    cy.contains('Must Read Titles').click();
    cy.get('[data-testid=list-item]')
      .should('have.length', 1)
      .and('contain', 'Pride and Prejudice');
  });

  it('should remove book from mustread', () => {
    cy.get('[data-testid=mustread]').click();
    cy.get('.logs .MuiListItem-root')
      .first()
      .should('contain', 'You removed a Book from Must Read Titles');

    cy.contains('Must Read Titles').click();
    cy.get('[data-testid=list-item]').should('not.exist');
  });

  it('should add book to wishlist', () => {
    cy.intercept('POST', '/graphql?paidBooks').as('paidBooks');
    cy.contains('Buy Books').click();
    cy.wait('@paidBooks');
    cy.get('[data-testid=list-item]').first().click();

    cy.get('[data-testid=wishlist]').click();
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You added a Book to Wishlist');

    cy.contains('Wishlist').click();
    cy.get('[data-testid=list-item]')
      .should('have.length', 1)
      .and('contain', 'The Hound of the Baskervilles');
  });

  it('should remove book from wishlist', () => {
    cy.intercept('POST', '/graphql?paidBooks').as('paidBooks');
    cy.contains('Buy Books').click();
    cy.wait('@paidBooks');
    cy.get('[data-testid=list-item]').first().click();

    cy.get('[data-testid=wishlist]').click();
    cy.get('.logs .MuiListItem-root').first().should('contain', 'You removed a Book from Wishlist');

    cy.contains('Wishlist').click();
    cy.get('[data-testid=list-item]').should('not.exist');
  });

  it('should open book reader', () => {
    cy.get('[data-testid=read]').click();

    cy.url().should('include', '/books/read');
  });
});
