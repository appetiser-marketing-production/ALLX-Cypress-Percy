import '@percy/cypress';

describe('Percy Visual Test for Single Blog', () => {
    // This ignores uncaught exceptions from the application, preventing them from failing the test.
    Cypress.on('uncaught:exception', () => false);

    const pagesToTest = [
        { name: 'The Most Loved and Hated Programming Languages (With Developer’s Insights and Tips)', url: 'https://appetiser.com.au/blog/most-loved-programming-languages/' }
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
                    cy.get('body').should('be.visible');
                    cy.wait(2000);
                });

                it(`should take screenshots on ${page.name}`, () => {
                    const selectors = [
                        '.infinite-single-article-head',
                        '.infinite-single-article-thumbnail.infinite-media-image',
                        '.infinite-single-article-content',
                        '#single-social-sharex',
                        '.saboxplugin-wrap',
                        '#blog-bottom-case-study'
                    ];

                    selectors.forEach((selector, index) => {
                        cy.get('body').then($body => {
                            if ($body.find(selector).length > 0) {
                                cy.get(selector)
                                    .filter(':visible')
                                    .each(($el, elIndex) => {
                                        const elHeight = $el.height();
                                        const elOpacity = $el.css('opacity');

                                        if (elHeight > 0 && elOpacity !== '0') {

                                            cy.wrap($el)
                                                .scrollIntoView({ duration: 1000 })
                                                .should('be.visible')
                                                .wait(1000);
                                        } else {
                                            cy.log(`Skipping element ${selector} at index ${elIndex} due to height: ${elHeight} or opacity: ${elOpacity}`);
                                        }
                                    });
                            } else {
                                cy.log(`Element ${selector} not found on page`);
                            }
                        });
                    });

                    cy.scrollTo('top');
                    cy.percySnapshot(`${page.name} - ${viewport.name} - ${viewport.width}px`, {
                        widths: [viewport.width],
                        minHeight: 1000,
                        percyCSS: `
                            #hubspot-messages-iframe-container,
                            .call_cta.icon_phone,
                            .CampaignType--slide{
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




