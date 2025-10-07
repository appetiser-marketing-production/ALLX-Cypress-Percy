describe('Argos Visual Test for Header ', () => {
    // This handles uncaught exceptions for all tests within this describe block
    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false
    })

    // Define the viewports you want to test
    const viewports = [
        { name: 'Desktop', width: 1920, height: 1080},
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
    ]

    // Loop through each viewport configuration
    viewports.forEach((viewport) => {

        // Create a context for each viewport for better organization in test runner
        context(`Visual Test - Header ${viewport.name} (${viewport.width}x${viewport.height})`, () => {

            // Runs before each test within this context block
            beforeEach(() => {
                // Block GA4 and GTM tracking requests
                cy.intercept('https://www.google-analytics.com/**', { statusCode: 204 });
                cy.intercept('https://www.googletagmanager.com/*', { statusCode: 204 });
                cy.intercept('https://www.googletagmanager.com/*/*', { statusCode: 204 });
                // Set the viewport for the current test iteration
                cy.viewport(viewport.width, viewport.height)
                // Visit the Header
                cy.visit('http://appetiser.local/')
                cy.get('body').should('be.visible')
                cy.get('.gdlr-core-page-builder-body *').invoke('css', 'opacity', '1')
                cy.get('#hubspot-messages-iframe-container').invoke('css', 'opacity', '0')
            })

            // --- Test Case for the specific viewport ---
            it(`Visual Test - Header: ${viewport.name}`, () => {

                // --- Desktop Specific Tests ---
                if (viewport.name === 'Desktop') {
                    cy.get('header.infinite-header-wrap').should('be.visible').wait(2000).argosScreenshot("Header ", { viewports: [{ width: viewport.width, height: viewport.height }] })
                }

                // --- Tablet Specific Tests ---
                else if (viewport.name === 'Tablet') {
                    cy.get('.call_cta.icon_phone[href="tel:+61390000618"]').invoke('css', 'opacity', '0')
                    cy.get('.infinite-mobile-header-wrap').should('be.visible').wait(2000).argosScreenshot("Header ", { viewports: [{ width: viewport.width, height: viewport.height }] })
                }

                // --- Mobile Specific Tests ---
                else if (viewport.name === 'Mobile') {
                    cy.get('.call_cta.icon_phone[href="tel:+61390000618"]').invoke('css', 'opacity', '0')
                    cy.get('.infinite-mobile-header-wrap').should('be.visible').wait(2000).argosScreenshot("Header ", { viewports: [{ width: viewport.width, height: viewport.height }] })
                }
            })
        })
    })
})