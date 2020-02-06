// tslint:disable: no-duplicate-string
describe('Profile page', () => {
  const emailField = '[data-test=email]';
  const firstNameField = '[data-test=firstName]';
  const lastNameField = '[data-test=lastName]';
  const submitBtn = '[data-test=submit]';
  const publicUrl = '/assets/icons/icon-512x512.png';

  const clearFields = () => {
    [firstNameField, lastNameField, emailField].forEach(field => {
      cy.get(field).clear();
    });
  };

  beforeEach(() => {
    cy.exec('npm run seed:db');
    cy.login('user@test.com', 'password');
    cy.get('#user-menu-toggler').click();
    cy.contains('Edit Profile').click();
  });

  context('invalid form', () => {
    beforeEach(() => {
      clearFields();
    });

    it('should display required errors', () => {
      cy.get(submitBtn).click();
      cy.get('mat-error')
        .should('have.length', 3)
        .and('contain', 'This field is required');
    });

    it('should display incorrect email error', () => {
      cy.get(emailField).type('incorrect-email');
      cy.get(submitBtn).click();
      cy.get('mat-error')
        .should('have.length', 3)
        .and('contain', 'Not a valid email');
    });
  });

  context('valid form', () => {
    beforeEach(() => {
      clearFields();
    });

    it('should show server error', () => {
      cy.get(firstNameField).type('User 1');
      cy.get(lastNameField).type('Test 1');
      cy.get(emailField).type('admin@test.com');
      cy.get(submitBtn).click();

      cy.get('mat-error')
        .should('have.length', 1)
        .and('contain', 'EMAIL_IN_USE_ERR');
    });

    it('should update profile', () => {
      cy.get(firstNameField).type('User 1');
      cy.get(lastNameField).type('Test 1');
      cy.get(emailField).type('user1@test.com');
      cy.get(submitBtn).click();

      cy.get('.mat-snack-bar-container')
        .should('be.visible')
        .and('contain', 'Profile updated');

      cy.get('.user-menu').should('contain', 'User 1 Test 1');
    });
  });

  context('changing avatar', () => {
    beforeEach(() => {
      cy.get('[data-test=showSelector]').click();
    });

    it('should close avatar selector', () => {
      cy.get('[data-test=cancel]').click();
      cy.contains('Select File').should('not.exist');
    });

    it('should do nothing if file is not selected', () => {
      cy.get('[data-test=upload]').click();
    });

    it('should show error if mime type is invalid', () => {
      cy.fixture('empty.pdf', 'base64').then(fileContent => {
        cy.get('[data-test="file-input"]').upload(
          { fileContent, fileName: 'empty.pdf', mimeType: 'application/pdf' },
          { subjectType: 'input' }
        );
        cy.get('.mat-error')
          .should('be.visible')
          .and('contain', 'INVALID_IMG_ERR');
      });
    });

    it('should upload avatar', () => {
      cy.uploadOnServer({ publicUrl });

      cy.fixture('icon.png', 'base64').then(fileContent => {
        cy.get('[data-test="file-input"]').upload(
          { fileContent, fileName: 'icon.png', mimeType: 'image/png' },
          { subjectType: 'input' }
        );
        cy.get('[data-test=upload]').click();
        cy.get('.mat-snack-bar-container')
          .should('be.visible')
          .and('contain', 'Profile updated');
        cy.get('.avatar').should('have.attr', 'src', publicUrl);
        cy.get('[data-test=avatar]').should('have.attr', 'src', publicUrl);
      });
    });
  });
});
