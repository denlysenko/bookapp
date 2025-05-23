describe('Auth page', () => {
  const emailField = '[data-test=email]';
  const passwordField = '[data-test=password]';
  const firstNameField = '[data-test=firstName]';
  const lastNameField = '[data-test=lastName]';

  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.visit('/auth');
  });

  describe('Login', () => {
    it('should have login title', () => {
      cy.get('mat-card-title').should('contain', 'Login into account');
    });

    context('not valid form', () => {
      it('should display required errors', () => {
        cy.get('[data-test=submit]').click();
        cy.get('mat-error').should('have.length', 2).and('contain', 'This field is required');
      });

      it('should display incorrect email error', () => {
        cy.get(emailField).type('incorrect-email{enter}');
        cy.get('mat-error').should('have.length', 2).and('contain', 'Not a valid email');
      });
    });

    context('valid form', () => {
      it('should show server errors', () => {
        const logins = [
          {
            email: 'user2@test.com',
            password: 'password{enter}',
            expectedError: 'Incorrect email or password.',
          },
          {
            email: 'user@test.com',
            password: 'password2{enter}',
            expectedError: 'Incorrect email or password.',
          },
        ];

        cy.wrap(logins).each((login: any) => {
          cy.get(emailField).clear().type(login.email);
          cy.get(passwordField).clear().type(login.password);

          cy.get('mat-snack-bar-container')
            .should('be.visible')
            .and('contain', login.expectedError);
        });
      });

      it('should login and redirect', () => {
        cy.get(emailField).type('user@test.com');
        cy.get(passwordField).type('password{enter}');

        cy.url().should('include', '/books/browse');
      });
    });
  });

  describe('Register', () => {
    beforeEach(() => {
      cy.get('[data-test=toggle]').click();
    });

    it('should have register title', () => {
      cy.get('mat-card-title').should('contain', 'Create account');
    });

    context('not valid form', () => {
      it('should display required errors', () => {
        cy.get('[data-test=submit]').click();
        cy.get('mat-error').should('have.length', 4).and('contain', 'This field is required');
      });

      it('should display incorrect email error', () => {
        cy.get(emailField).type('incorrect-email{enter}');
        cy.get('mat-error').should('have.length', 4).and('contain', 'Not a valid email');
      });
    });

    context('valid form', () => {
      /**
       * TODO: since mongo-seeding-cli does not support re-indexing after populating db
       * custom seed helper need to be created which uses mongoose to seed data
       */
      // it('should show server error', () => {
      //   cy.get(firstNameField).type('NewUser');
      //   cy.get(lastNameField).type('NewUser');
      //   cy.get(emailField).type('user@test.com');
      //   cy.get(passwordField).type('password{enter}');

      //   cy.get('mat-snack-bar-container')
      //     .should('be.visible')
      //     .and('contain', 'Email is already in use.');
      // });

      it('should register and redirect', () => {
        cy.get(firstNameField).type('NewUser');
        cy.get(lastNameField).type('NewUser');
        cy.get(emailField).type('newuser@test.com');
        cy.get(passwordField).type('password{enter}');

        cy.url().should('include', '/books/browse');
      });
    });
  });
});
