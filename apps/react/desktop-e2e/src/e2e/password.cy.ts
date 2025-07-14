describe('Change Password Page', () => {
  const oldPasswordField = '[name=oldPassword]';
  const passwordField = '[name=password]';
  const submitBtn = '[data-testid=save]';

  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.get('#user-menu').click();
    cy.contains('Change Password').click();
  });

  context('invalid form', () => {
    it('should display required errors', () => {
      cy.get(submitBtn).click();
      cy.get('.MuiFormHelperText-contained.Mui-error')
        .should('have.length', 2)
        .and('contain', 'This field is required');
    });
  });

  context('valid form', () => {
    it('should show server error', () => {
      cy.get(oldPasswordField).type('password1');
      cy.get(passwordField).type('password2');
      cy.get(submitBtn).click();

      cy.get('.MuiSnackbarContent-root')
        .should('be.visible')
        .and('contain', 'Old password is incorrect.');
    });

    it('should update password', () => {
      cy.get(oldPasswordField).type('password');
      cy.get(passwordField).type('password1');
      cy.get(submitBtn).click();

      cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Password changed!');
    });
  });
});
