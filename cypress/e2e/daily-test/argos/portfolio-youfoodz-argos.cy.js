import '@percy/cypress';

describe('Percy Visual Test for Portfolio Youfoodz', () => {
    // This ignores uncaught exceptions from the application, preventing them from failing the test.
    Cypress.on('uncaught:exception', () => false);

    const pagesToTest = [
        { name: 'Portfolio Youfoodz', url: 'https://appetiser.com.au/portfolio/youfoodz/' }
    ];

    const viewports = [
        { name: 'Desktop', width: 1920, height: 1080 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
    ];

    pagesToTest.forEach((page) => {
        viewports.forEach((viewport) => {
            context(`Visual Test - ${page.name} - ${viewport.name} (${viewport.width}x${viewport.height})`, () => {

                beforeEach(() => {
                    cy.intercept('https://www.google-analytics.com/**', { statusCode: 204 });
                    cy.intercept('https://www.googletagmanager.com/**', { statusCode: 204 });
                    cy.viewport(viewport.width, viewport.height);
                    cy.visit(page.url);
                    cy.get('.gdlr-core-page-builder-body').should('be.visible');
                    cy.wait(1000);
                });

                it(`should take screenshots on ${page.name}`, () => {
                    const selector = '.gdlr-core-page-builder-body .gdlr-core-pbf-wrapper';

                    cy.get(selector)
                        .filter(':visible') 
                        .each(($el, index) => {
                            const elHeight = $el.height();
                            const elOpacity = $el.css('opacity');

                            if (elHeight > 0 && elOpacity !== '0') {
                                cy.wrap($el)
                                    .scrollIntoView({ duration: 1000 })
                                    .wait(1000)
                                    .should('be.visible');
                            } else {
                                cy.log(`Skipping element at index ${index} due to height: ${elHeight} or opacity: ${elOpacity}`);
                            }
                        });

                    cy.scrollTo('top');
                    cy.percySnapshot(`${page.name} - ${viewport.name} - ${viewport.width}px`, {
                        widths: [viewport.width],
                        minHeight: 1000,
                        percyCSS: `
                            #hubspot-messages-iframe-container,
                            .call_cta.icon_phone {
                                display: none !important;
                            }
                            *, *::before, *::after {
                                animation-duration: 0s !important;
                                animation-delay: 0s !important;
                                transition-duration: 0s !important;
                                transition-delay: 0s !important;
                            }
                        `
                    });
                });
            });
        });
    });
});




