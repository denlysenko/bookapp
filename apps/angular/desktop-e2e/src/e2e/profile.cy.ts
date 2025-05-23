describe('Profile page', () => {
  const emailField = '[data-test=email]';
  const firstNameField = '[data-test=firstName]';
  const lastNameField = '[data-test=lastName]';
  const submitBtn = '[data-test=submit]';
  const publicUrl = '/assets/icons/icon-512x512.png';

  const clearFields = () => {
    [firstNameField, lastNameField, emailField].forEach((field) => {
      cy.get(field).clear();
    });
  };

  before(() => {
    cy.task('seedDatabase');
  });

  beforeEach(() => {
    cy.login('user@test.com', 'password');
    cy.intercept('POST', '/graphql?updateUser').as('updateUser');
    cy.get('#user-menu-toggler').click();
    cy.contains('Edit Profile').click({ force: true });
  });

  context('invalid form', () => {
    beforeEach(() => {
      clearFields();
    });

    it('should display required errors', () => {
      cy.get(submitBtn).click();
      cy.get('mat-error').should('have.length', 3).and('contain', 'This field is required');
    });

    it('should display incorrect email error', () => {
      cy.get(emailField).type('incorrect-email');
      cy.get(submitBtn).click();
      cy.get('mat-error').should('have.length', 3).and('contain', 'Not a valid email');
    });
  });

  context('valid form', () => {
    beforeEach(() => {
      clearFields();
    });

    // TODO: the same as in Register tests. Do not forget that email changes and login in before each won't work
    // it('should show server error', () => {
    //   cy.get(firstNameField).type('User 1');
    //   cy.get(lastNameField).type('Test 1');
    //   cy.get(emailField).type('admin@test.com');
    //   cy.get(submitBtn).click();

    //   cy.get('mat-error').should('have.length', 1).and('contain', 'EMAIL_IN_USE_ERR');
    // });

    it('should update profile', () => {
      cy.get(firstNameField).type('User 1');
      cy.get(lastNameField).type('Test 1');
      cy.get(emailField).type('user@test.com');
      cy.get(submitBtn).click();
      cy.wait('@updateUser');
      cy.get('mat-snack-bar-container').should('be.visible').and('contain', 'Profile updated');
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
      cy.get('[data-test="file-input"]').attachFile('empty.pdf', { subjectType: 'input' });
      cy.get('.mat-mdc-form-field-error')
        .should('be.visible')
        .and('contain', 'Invalid image format.');
    });

    it('should upload avatar', () => {
      cy.uploadOnServer({ publicUrl });

      cy.get('[data-test="file-input"]').attachFile('icon.png', { subjectType: 'input' });
      // wait until image cropper initialized
      cy.wait(800);
      cy.get('[data-test=upload]').click();
      cy.wait('@updateUser');
      cy.get('mat-snack-bar-container').should('be.visible').and('contain', 'Profile updated');
      cy.get('.avatar').should('have.attr', 'src', publicUrl);
      cy.get('[data-test=avatar]').should('have.attr', 'src', publicUrl);
    });
  });
});
