import '@percy/cypress';

describe('Percy Visual Test for Portfolio Youfoodz', () => {
    // This ignores uncaught exceptions from the application, preventing them from failing the test.
    Cypress.on('uncaught:exception', () => false);

    const pagesToTest = [
        { name: 'Portfolio Youfoodz', url: 'https://appetiser.com.au/portfolio/youfoodz/' }
    ];

    const viewports = [
        { name: 'Desktop', width: 1920, height: 1080},
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
                    const disableAnimations = `
                        <style>
                        *, *::before, *::after {
                            -webkit-animation: none !important;
                            -moz-animation: none !important;
                            -o-animation: none !important;
                            animation: none !important;
                            -webkit-transition: none !important;
                            -moz-transition: none !important;
                            -o-transition: none !important;
                            transition: none !important;
                        }
                        </style>
                    `;
                    cy.get("head").invoke("append", disableAnimations);
                    cy.wait(2000);

                    cy.get('body').then($body => {
                        if ($body.find('#hubspot-messages-iframe-container').length) {
                            cy.get('#hubspot-messages-iframe-container').invoke('css', 'opacity', '0');
                        }
                        if ((viewport.name === 'Tablet' || viewport.name === 'Mobile') && $body.find('.call_cta.icon_phone[href="tel:+61390000618"]').length) {
                            cy.get('.call_cta.icon_phone[href="tel:+61390000618"]').invoke('css', 'opacity', '0');
                        }
                    });
                });

                it(`should take screenshots on ${page.name}`, () => {
                    const selector = '.gdlr-core-page-builder-body .gdlr-core-pbf-wrapper';
                    
                    // First, scroll through all visible wrapper elements
                    cy.get(selector)
                        .filter(':visible') // First-pass filter for basic visibility
                        .each(($el, index) => {
                            // --- KEY CHANGE: Add a robust check for height and opacity ---
                            // We use the element's jQuery methods to get its computed CSS properties.
                            const elHeight = $el.height();
                            const elOpacity = $el.css('opacity');

                            // Only proceed if the element has a height and is not transparent.
                            if (elHeight > 0 && elOpacity !== '0') {
                                cy.wrap($el)
                                    .scrollIntoView({ duration: 1000 })
                                    .should('be.visible')
                                    .wait(1000);
                            } else {
                                // (Optional) This log helps you see which elements are being skipped and why.
                                // You can view it in the Cypress Test Runner for debugging.
                                cy.log(`Skipping element at index ${index} due to height: ${elHeight} or opacity: ${elOpacity}`);
                            }
                        });
                    
                    // After scrolling through all elements, take a Percy snapshot
                    cy.percySnapshot(`${page.name}`, {
                        widths: [viewport.width]
                    });
                });
            });
        });
    });
});
