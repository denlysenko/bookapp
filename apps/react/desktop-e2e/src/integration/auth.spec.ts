// tslint:disable: no-hardcoded-credentials

// tslint:disable: no-duplicate-string

// tslint:disable: no-identical-functions

describe('Auth page', () => {
  const emailField = '[name=email]';
  const passwordField = '[name=password]';
  const firstNameField = '[name=firstName]';
  const lastNameField = '[name=lastName]';

  beforeEach(() => {
    cy.visit('/auth');
  });

  describe('Login', () => {
    it('should have login title', () => {
      cy.get('[data-testid=title]').should('contain', 'Login into account');
    });

    context('not valid form', () => {
      it('should display required errors', () => {
        cy.get('[data-testid=submit]').click();
        cy.get('.MuiFormHelperText-contained.Mui-error')
          .should('have.length', 2)
          .and('contain', 'This field is required');
      });

      it('should display incorrect email error', () => {
        cy.get(emailField).type('incorrect-email{enter}');
        cy.get('.MuiFormHelperText-contained.Mui-error')
          .should('have.length', 2)
          .and('contain', 'Not a valid email');
      });
    });

    context('valid form', () => {
      beforeEach(() => {
        cy.exec('npm run seed:db');
      });

      it('should show server errors', () => {
        const logins = [
          {
            email: 'user2@test.com',
            password: 'password{enter}',
            expectedError: 'INCORRECT_EMAIL_ERR',
          },
          {
            email: 'user@test.com',
            password: 'password2{enter}',
            expectedError: 'INCORRECT_PASSWORD_ERR',
          },
        ];

        cy.wrap(logins).each((login: any) => {
          cy.get(emailField).clear().type(login.email);
          cy.get(passwordField).clear().type(login.password);

          cy.get('.MuiSnackbarContent-message')
            .should('be.visible')
            .and('contain', login.expectedError);
        });
      });

      it('should login and redirect', () => {
        cy.get(emailField).type('user@test.com');
        cy.get(passwordField).type('password{enter}');

        cy.url().should('include', '/'); // TODO: replace with /books/browse
        // cy.get('.user-menu').should('contain', 'User Test');
      });
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      cy.get('[data-testid=toggle]').click();
    });

    it('should have register title', () => {
      cy.get('[data-testid=title]').should('contain', 'Create account');
    });

    context('not valid form', () => {
      it('should display required errors', () => {
        cy.get('[data-testid=submit]').click();
        cy.get('.MuiFormHelperText-contained.Mui-error')
          .should('have.length', 4)
          .and('contain', 'This field is required');
      });

      it('should display incorrect email error', () => {
        cy.get(emailField).type('incorrect-email{enter}');
        cy.get('.MuiFormHelperText-contained.Mui-error')
          .should('have.length', 4)
          .and('contain', 'Not a valid email');
      });
    });

    context('valid form', () => {
      beforeEach(() => {
        cy.exec('npm run seed:db');
      });

      it('should show server error', () => {
        cy.get(firstNameField).type('NewUser');
        cy.get(lastNameField).type('NewUser');
        cy.get(emailField).type('user@test.com');
        cy.get(passwordField).type('password{enter}');

        cy.get('.MuiFormHelperText-contained.Mui-error')
          .should('have.length', 1)
          .and('contain', 'EMAIL_IN_USE_ERR');
      });

      it('should register and redirect', () => {
        cy.get(firstNameField).type('NewUser');
        cy.get(lastNameField).type('NewUser');
        cy.get(emailField).type('newuser@test.com');
        cy.get(passwordField).type('password{enter}');

        cy.url().should('include', '/'); // TODO: replace with /books/browse
        // cy.get('.user-menu').should('contain', 'NewUser NewUser');
      });
    });
  });
});
