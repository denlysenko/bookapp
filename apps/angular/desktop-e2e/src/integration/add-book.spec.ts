describe('Add Book Page', () => {
  const titleField = '[data-test=title]';
  const authorField = '[data-test=author]';
  const descriptionField = '[data-test=description]';
  const saveBtn = '[data-test=save]';
  const paidCheckbox = '[data-test=paid]';
  const priceField = '[data-test=price]';

  beforeEach(() => {
    cy.exec('npm run seed:db');
  });

  describe('Create book', () => {
    context('role user', () => {
      beforeEach(() => {
        cy.login('user@test.com', 'password');
      });

      it('add book link should be hidden', () => {
        cy.contains('Add Book').should('not.be.visible');
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
        cy.get(priceField).should('not.be.visible');
        cy.get(paidCheckbox).click();
        cy.get(priceField).should('be.visible');
      });

      it('should show confirm dialog when leaving page and form has changes', () => {
        cy.get(titleField).type('title');
        cy.go('back');

        cy.contains(
          'There are unsaved changes on the page. Are you sure you want to leave?'
        ).should('be.visible');
      });

      context('invalid form', () => {
        it('should show required errors', () => {
          cy.get(paidCheckbox).click();
          cy.get(saveBtn).click();

          cy.get('.mat-error')
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

          cy.get('.mat-snack-bar-container')
            .should('be.visible')
            .and('contain', 'Book created!');

          cy.contains('Browse Books').click();

          cy.get('[data-test=list-item]').should('have.length', 5);
          cy.get('.logs .mat-list-item')
            .should('have.length', 1)
            .and('contain', 'You created a Book');
        });

        it('should save paid book', () => {
          cy.get(titleField).type('Paid Book');
          cy.get(authorField).type('Genius');
          cy.get(descriptionField).type('Paid Book from Genius author');
          cy.get(paidCheckbox).click();
          cy.get(priceField).type('5');
          cy.get(saveBtn).click();

          cy.get('.mat-snack-bar-container')
            .should('be.visible')
            .and('contain', 'Book created!');

          cy.contains('Buy Books').click();

          cy.get('[data-test=list-item]').should('have.length', 4);
          cy.get('.logs .mat-list-item')
            .should('have.length', 1)
            .and('contain', 'You created a Book');
        });
      });

      context('cover', () => {
        beforeEach(() => {
          cy.get('[data-test=cover-selector]').click();
        });

        it('should close cover selector', () => {
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

        it('should upload cover', () => {
          const publicUrl = '/assets/icons/icon-512x512.png';

          cy.uploadOnServer({
            publicUrl
          });

          cy.fixture('icon.png', 'base64').then(fileContent => {
            cy.get('[data-test="file-input"]').upload(
              { fileContent, fileName: 'icon.png', mimeType: 'image/png' },
              { subjectType: 'input' }
            );
            cy.get('[data-test=upload]').click();

            cy.get('[data-test=cover]').should('have.attr', 'src', publicUrl);
          });
        });
      });

      context('epub', () => {
        beforeEach(() => {
          cy.get('[data-test=file-selector]').click();
        });

        it('should close file selector', () => {
          cy.get('[data-test=cancel]').click();
          cy.contains('Select File').should('not.exist');
        });

        it('should do nothing if file is not selected', () => {
          cy.get('[data-test=upload]').click();
        });

        it('should upload epub', () => {
          const publicUrl = '/assets/icons/icon-512x512.png';

          cy.uploadOnServer({
            publicUrl
          });

          cy.fixture('empty.pdf', 'base64').then(fileContent => {
            cy.get('[data-test="file-input"]').upload(
              { fileContent, fileName: 'empty.pdf', mimeType: 'application/pdf' },
              { subjectType: 'input' }
            );
            cy.get('[data-test=upload]').click();

            cy.get('[data-test=download]')
              .should('be.visible')
              .and('have.attr', 'href', publicUrl);
          });
        });
      });
    });
  });

  describe('Update book', () => {
    context('role user', () => {
      beforeEach(() => {
        cy.login('user@test.com', 'password');
        cy.get('[data-test=list-item]')
          .first()
          .click();
      });

      it('edit book link should be hidden', () => {
        cy.get('#edit').should('not.exist');
      });

      it('should guard route', () => {
        cy.url().then(url => {
          const parts = url.split('/').slice(-2);
          const path = parts.map(part => part.replace(/\?.*/, '')).join('/');
          cy.visit(`/books/add/${path}`);
          cy.url().should('include', '/books/browse');
        });
      });
    });

    context('role admin', () => {
      beforeEach(() => {
        cy.login('admin@test.com', 'password');
        cy.get('[data-test=list-item]')
          .first()
          .click();
        cy.get('#edit').click();
      });

      it('should update book', () => {
        cy.get(titleField)
          .clear()
          .type('Updated');
        cy.get(saveBtn).click();

        cy.get('.mat-snack-bar-container')
          .should('be.visible')
          .and('contain', 'Book updated!');

        cy.get('.logs .mat-list-item')
          .should('have.length', 1)
          .and('contain', 'You updated a Book');

        cy.go('back');
        cy.get('[data-test=title]').should('contain', 'Updated');
      });
    });
  });
});
