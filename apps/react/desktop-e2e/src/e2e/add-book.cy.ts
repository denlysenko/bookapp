describe('Add Book Page', () => {
  const titleField = '[name=title]';
  const authorField = '[name=author]';
  const descriptionField = '[name=description]';
  const saveBtn = '[data-testid=save]';
  const paidCheckbox = '[data-testid=paid]';
  const priceField = '[name=price]';

  before(() => {
    cy.task('seedDatabase');
  });

  describe('Create book', () => {
    context('role user', () => {
      beforeEach(() => {
        cy.login('user@test.com', 'password');
      });

      it('add book link should be hidden', () => {
        cy.contains('Add Book').should('not.exist');
      });

      it('should guard route', () => {
        cy.visit('/books/add');
        cy.url().should('include', '/books/browse');
      });
    });

    context('role admin', () => {
      beforeEach(() => {
        cy.login('admin@test.com', 'password');
        cy.contains('Add Book').click();
      });

      it('should toggle price field', () => {
        cy.get(priceField).should('not.exist');
        cy.get(paidCheckbox).click();

        cy.get(priceField).should('be.visible');
      });

      context('invalid form', () => {
        it('should show required errors', () => {
          cy.get(paidCheckbox).click();
          cy.get(saveBtn).click();

          cy.get('.MuiFormHelperText-contained.Mui-error')
            .should('have.length', 4)
            .and('contain', 'This field is required');
        });
      });

      context('valid form', () => {
        it('should save free book', () => {
          cy.get(titleField).type('Free Book');
          cy.get(authorField).type('Genius');
          cy.get(descriptionField).type('Free Book from Genius author');
          cy.get(saveBtn).click();

          cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Book created!');

          cy.contains('Browse Books').click();

          cy.get('[data-testid=list-item]').should('have.length', 5);
          cy.get('.logs .MuiListItem-root').first().should('contain', 'You created a Book');
        });

        it('should save paid book', () => {
          cy.get(titleField).type('Paid Book');
          cy.get(authorField).type('Genius');
          cy.get(descriptionField).type('Paid Book from Genius author');
          cy.get(paidCheckbox).click();
          cy.get(priceField).type('5');
          cy.get(saveBtn).click();

          cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Book created!');

          cy.contains('Buy Books').click();

          cy.get('[data-testid=list-item]').should('have.length', 4);
          cy.get('.logs .MuiListItem-root').first().should('contain', 'You created a Book');
        });
      });

      context('cover', () => {
        beforeEach(() => {
          cy.get('[data-testid=cover-selector]').click();
        });

        it('should close cover selector', () => {
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

        it('should upload cover', () => {
          const publicUrl = '/assets/icons/icon-512x512.png';

          cy.uploadOnServer({
            publicUrl,
          });

          cy.get('[data-testid="file-input"]').attachFile('icon.png', { subjectType: 'input' });
          // wait until image cropper initialized
          cy.wait(800);
          cy.get('[data-testid=upload]').click();

          cy.get('[data-testid=cover]').should('have.attr', 'src', publicUrl);
        });
      });

      context('epub', () => {
        beforeEach(() => {
          cy.get('[data-testid=file-selector]').click();
        });

        it('should close file selector', () => {
          cy.get('[data-testid=cancel]').click();
          cy.contains('Select File').should('not.exist');
        });

        it('should do nothing if file is not selected', () => {
          cy.get('[data-testid=upload]').click();
        });

        it('should upload epub', () => {
          const publicUrl = '/assets/icons/icon-512x512.png';

          cy.uploadOnServer({
            publicUrl,
          });

          cy.get('[data-testid="file-input"]').attachFile('empty.pdf', { subjectType: 'input' });
          cy.get('[data-testid=upload]').click();

          cy.get('[data-testid=download]').should('be.visible').and('have.attr', 'href', publicUrl);
        });
      });
    });
  });

  describe('Update book', () => {
    context('role user', () => {
      beforeEach(() => {
        cy.login('user@test.com', 'password');
        cy.get('[data-testid=list-item]').first().click();
      });

      it('edit book link should be hidden', () => {
        cy.get('#edit').should('not.exist');
      });

      it('should guard route', () => {
        cy.url().then((url) => {
          const parts = url.split('/').slice(-2);
          const path = parts.map((part) => part.replace(/\?.*/, '')).join('/');
          cy.visit(`/books/add/${path}`);
          cy.url().should('include', '/books/browse');
        });
      });
    });

    context('role admin', () => {
      beforeEach(() => {
        cy.login('admin@test.com', 'password');
        cy.get('[data-testid=list-item]').first().click();
        cy.get('[data-testid=edit]').click();
      });

      it('should update book', () => {
        cy.get(titleField).clear().type('Updated');
        cy.get(saveBtn).click();

        cy.get('.MuiSnackbarContent-root').should('be.visible').and('contain', 'Book updated!');

        cy.get('.logs .MuiListItem-root').first().should('contain', 'You updated a Book');
      });
    });
  });
});
