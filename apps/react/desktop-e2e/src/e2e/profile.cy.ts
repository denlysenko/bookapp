describe('Profile page', () => {
  const emailField = '[name=email]';
  const firstNameField = '[name=firstName]';
  const lastNameField = '[name=lastName]';
  const submitBtn = '[data-testid=save]';
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
    cy.get('#user-menu').click();
    cy.contains('Edit Profile').click();
  });

  context('invalid form', () => {
    beforeEach(() => {
      clearFields();
    });

    it('should display required errors', () => {
      cy.get(submitBtn).click();
      cy.get('.MuiFormHelperText-contained.Mui-error')
        .should('have.length', 3)
        .and('contain', 'This field is required');
    });

    it('should display incorrect email error', () => {
      cy.get(emailField).type('incorrect-email');
      cy.get(submitBtn).click();
      cy.get('.MuiFormHelperText-contained.Mui-error')
        .should('have.length', 3)
        .and('contain', 'Not a valid email');
    });
  });

  context('valid form', () => {
    beforeEach(() => {
      clearFields();
    });

    // it('should show server error', () => {
    //   cy.get(firstNameField).type('User 1');
    //   cy.get(lastNameField).type('Test 1');
    //   cy.get(emailField).type('admin@test.com');
    //   cy.get(submitBtn).click();

    //   cy.get('.MuiFormHelperText-contained.Mui-error')
    //     .should('have.length', 1)
    //     .and('contain', 'Email is already in use.');
    // });

    it('should update profile', () => {
      cy.get(firstNameField).type('User 1');
      cy.get(lastNameField).type('Test 1');
      cy.get(emailField).type('user@test.com');
      cy.get(submitBtn).click();
      cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Profile updated');

      cy.get('#user-menu').should('contain', 'User 1 Test 1');
    });
  });

  context('changing avatar', () => {
    beforeEach(() => {
      cy.get('[data-testid=showSelector]').click();
    });

    it('should close avatar selector', () => {
      cy.get('[data-testid=cancel]').click();
      cy.contains('Select File').should('not.exist');
    });

    it('should do nothing if file is not selected', () => {
      cy.get('[data-testid=upload]').click();
    });

    it('should show error if mime type is invalid', () => {
      cy.get('[data-testid="file-input"]').attachFile('empty.pdf', { subjectType: 'input' });
      cy.get('.error').should('be.visible').and('contain', 'Invalid image format.');
    });

    it('should upload avatar', () => {
      cy.uploadOnServer({ publicUrl });

      cy.get('[data-testid="file-input"]').attachFile('icon.png', { subjectType: 'input' });
      // wait until image cropper initialized
      cy.wait(800);
      cy.get('[data-testid=upload]').click();
      cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Profile updated');
      cy.get('#user-menu img').should('have.attr', 'src', publicUrl);
      cy.get('[data-testid=avatar]').should('have.attr', 'src', publicUrl);
    });
  });
});
