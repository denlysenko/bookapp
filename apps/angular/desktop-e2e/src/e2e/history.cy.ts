describe('History Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.intercept('POST', '/graphql?logs').as('logs');
    cy.contains('History').click();
  });

  it('should display logs', () => {
    cy.get('.mat-mdc-row').should('have.length', 10);
  });

  it('should go to next page', () => {
    cy.get('.mat-mdc-paginator-navigation-next').click();
    cy.wait('@logs');
    cy.get('.mat-mdc-row').should('have.length', 4);
  });

  it('should change items per page', () => {
    cy.get('.mat-mdc-paginator-page-size-select').click();
    cy.get('.mat-mdc-option').contains('20').click();
    cy.wait('@logs');
    cy.get('.mat-mdc-row').should('have.length', 14);
  });

  it('should order by createdAt', () => {
    cy.get('.mat-mdc-row').first().as('firstRow').should('contain', '14.10.2019');
    cy.get('.mat-mdc-header-cell.mat-column-createdAt').click();
    cy.wait('@logs');
    cy.get('@firstRow').should('contain', '18.09.2019');
  });

  it('should redirect to book page', () => {
    cy.intercept('POST', '/graphql?book').as('book');
    cy.get('.mat-mdc-row').first().find('a').click();
    cy.wait('@book');
    cy.url().should('include', 'pride-and-prejudice');
  });
});
