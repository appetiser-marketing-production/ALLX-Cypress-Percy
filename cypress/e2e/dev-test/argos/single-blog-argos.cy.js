describe('Argos Visual Test for Single Blog', () => {
    // This ignores uncaught exceptions from the application, preventing them from failing the test.
    Cypress.on('uncaught:exception', () => false);

    const pagesToTest = [
        { name: '35 Tech Startup Ideas That Sell in 2025', url: 'https://dev.appetiser.com.au/blog/tech-startups-ideas/' },
        { name: '20 Best Minimum Viable Product Examples: What Iconic Brands and Newcomers Taught Me About Product Success', url: 'https://dev.appetiser.com.au/blog/minimum-viable-product-example/' },
        { name: 'The Most Loved and Hated Programming Languages (With Developer’s Insights and Tips)', url: 'https://dev.appetiser.com.au/blog/most-loved-programming-languages/' }
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
                    cy.visit(page.url, {
                        auth: {
                            username: Cypress.env('DEV_AUTH_USERNAME'),
                            password: Cypress.env('DEV_AUTH_PASSWORD'),
                        },
                    });

                    cy.get('body').should('be.visible');
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
                    cy.scrollTo(0, 500);
                    cy.get('.infinite-fixed-navigation.infinite-style-slide').invoke('css', 'opacity', '0');

                    cy.get('body').then($body => {
                        if ($body.find('#hubspot-messages-iframe-container').length) {
                            cy.get('#hubspot-messages-iframe-container').invoke('css', 'opacity', '0');
                        }
                        if ((viewport.name === 'Tablet' || viewport.name === 'Mobile') && $body.find('.call_cta.icon_phone[href="tel:+61390000618"]').length) {
                            cy.scrollTo(0, 500);
                            cy.get('.infinite-fixed-navigation.infinite-style-slide').invoke('css', 'opacity', '0');
                            cy.get('.call_cta.icon_phone[href="tel:+61390000618"]').invoke('css', 'opacity', '0');
                        }
                    });
                });

                it(`should take screenshots on ${page.name}`, () => {
                    const selectors = [
                        '.infinite-single-article-head',
                        '.infinite-single-article-thumbnail.infinite-media-image',
                        '.infinite-single-article-content',
                        '#single-social-sharex',
                        '.saboxplugin-wrap',
                        '#post-grid-wrapper'
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
                                            const screenshotName = `[${page.name}] ${selector.replace(/[.#]/g, '')} ${elIndex + 1} - ${viewport.name}`;

                                            cy.wrap($el)
                                                .scrollIntoView({ duration: 500 })
                                                .should('be.visible')
                                                .wait(1000)
                                                .argosScreenshot(screenshotName, {
                                                    disableCssAnimation: true,
                                                    waitForImgToLoad: true
                                                });
                                        } else {
                                            cy.log(`Skipping element ${selector} at index ${elIndex} due to height: ${elHeight} or opacity: ${elOpacity}`);
                                        }
                                    });
                            } else {
                                cy.log(`Element ${selector} not found on page`);
                            }
                        });
                    });
                });
            });
        });
    });
});