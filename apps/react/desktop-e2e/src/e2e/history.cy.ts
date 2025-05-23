describe('History Page', () => {
  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.contains('History').click();
  });

  it('should display logs', () => {
    cy.get('[data-testid=table-row]').should('have.length', 10);
  });

  it('should go to next page', () => {
    cy.get('[title="Go to next page"]').click();
    cy.get('[data-testid=table-row]').should('have.length', 4);
  });

  it('should change items per page', () => {
    cy.get('.MuiTablePagination-select.MuiTablePagination-input').click();
    cy.get('[data-value="20"]').click();
    cy.get('[data-testid=table-row]').should('have.length', 14);
  });

  it('should order by createdAt', () => {
    cy.get('[data-testid=table-row]').first().as('firstRow').should('contain', '14.10.2019');
    cy.get('.MuiTableSortLabel-root').click();
    cy.get('@firstRow').should('contain', '18.09.2019');
  });

  it('should redirect to book page', () => {
    cy.get('[data-testid=table-row]').first().find('a').click();
    cy.url().should('include', 'pride-and-prejudice');
  });
});
