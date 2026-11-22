describe('qwik-demo-app', () => {
  beforeEach(() => cy.visit('/'));

  it('renders the Image and Picture examples', () => {
    cy.get('article').eq(0).within(() => {
      cy.contains('h2', 'Image');
      cy.get('img[alt="Qwik Image example"]')
        .should('be.visible')
        .and(($image) => {
          expect(($image[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
        });
    });

    cy.get('article').eq(1).within(() => {
      cy.contains('h2', 'Picture');
      cy.get('picture source').should('have.length', 2);
      cy.get('img[alt="Qwik Picture example"]')
        .should('be.visible')
        .and(($image) => {
          expect(($image[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
        });
    });
  });
});
