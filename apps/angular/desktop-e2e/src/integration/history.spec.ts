// tslint:disable: no-duplicate-string
describe('History Page', () => {
  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.contains('History').click();
  });

  it('should display logs', () => {
    cy.get('.mat-row').should('have.length', 10);
  });

  it('should go to next page', () => {
    cy.get('.mat-paginator-navigation-next').click();
    cy.get('.mat-row').should('have.length', 4);
  });

  it('should change items per page', () => {
    cy.get('.mat-paginator-page-size-select').click();
    cy.get('mat-option[ng-reflect-value=20]').click();
    cy.get('.mat-row').should('have.length', 14);
  });

  it('should order by createdAt', () => {
    cy.get('.mat-row')
      .first()
      .as('firstRow')
      .should('contain', '14.10.2019');

    cy.get('.mat-header-cell.mat-column-createdAt').click();

    cy.get('@firstRow').should('contain', '18.09.2019');
  });

  it('should redirect to book page', () => {
    cy.get('.mat-row')
      .first()
      .find('a')
      .click();

    cy.url().should('include', 'pride-and-prejudice');
  });
});
