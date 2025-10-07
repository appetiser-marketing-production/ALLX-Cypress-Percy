import '@percy/cypress';

describe('Percy Visual Test for Contact Us', () => {
    // This ignores uncaught exceptions from the application, preventing them from failing the test.
    Cypress.on('uncaught:exception', () => false);

    const pagesToTest = [
        { name: 'Contact Us', url: 'https://appetiser.com.au/contact-us/' }
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
                    cy.wait(1000);

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

                    cy.get('#product_strategist--slider_forcefullwidth')
                        .scrollIntoView({ duration: 1000 })
                        .wait(1000)
                        .should('be.visible');

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




