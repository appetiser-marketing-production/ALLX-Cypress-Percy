describe('Form Submission Tests', function() {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    const name = Cypress.env('CONTACT_US_NAME')
    const email = Cypress.env('CONTACT_US_EMAIL')
    const phone = Cypress.env('CONTACT_US_PHONE')

    const testCases = [
        {
            name: 'Youfoodz Download Case Study',
            urls: [
                { name: 'Just Build It', url: 'https://appetiser.com.au/just-build-it/' },
                { name: 'Homepage', url: 'https://appetiser.com.au/' }
            ],
            testFunction: function() {
                cy.get(`#hsForm_${this.daily_test.Youfoodz_HUUB_ID}`).should('be.visible')
                cy.get(`#email-${this.daily_test.Youfoodz_HUUB_ID}`).should('be.visible').type(email, { force: true })
                cy.get(`#hsForm_${this.daily_test.Youfoodz_HUUB_ID}`).should('be.visible').submit()
            }
        },
        {
            name: 'Contact Form',
            urls: [
                { name: 'Just Build It', url: 'https://appetiser.com.au/just-build-it/' },
                { name: 'Homepage', url: 'https://appetiser.com.au/' },
                { name: 'Contact us', url: 'https://appetiser.com.au/contact-us/' },
                { name: 'Service', url: 'https://appetiser.com.au/services/' }
            ],
            testFunction: function() {
                cy.get(`#hsForm_${this.daily_test.HUUB_ID}`).should('be.visible', { force: true })
                cy.get(`#firstname-${this.daily_test.HUUB_ID}`).should('be.visible').type(name, { force: true })
                cy.get(`#email-${this.daily_test.HUUB_ID}`).should('be.visible').type(email, { force: true })
                cy.get(`#phone-${this.daily_test.HUUB_ID}`).should('be.visible').type(phone, { force: true })
                cy.get(`#hsForm_${this.daily_test.HUUB_ID}`).should('be.visible').submit()
            }
        }
    ]

    testCases.forEach((testCase) => {
        describe(`Test: ${testCase.name}`, function() {
            testCase.urls.forEach((target) => {
                describe(`Page: ${target.name}`, function() {
                    beforeEach(function() {
                        // Block GA4 and GTM tracking requests
                        cy.intercept('https://www.google-analytics.com/**', { statusCode: 204 });
                        cy.intercept('https://www.googletagmanager.com/*', { statusCode: 204 });
                        cy.intercept('https://www.googletagmanager.com/*/*', { statusCode: 204 });
                        cy.fixture('daily-test').as('daily_test');
                        cy.viewport(1920, 1080)
                        cy.visit(target.url)
                        cy.get('body', { timeout: 10000 }).should('be.visible')
                    })

                    it(`Form Submission Test - ${testCase.name}`, function() {
                        testCase.testFunction.call(this)
                    })
                })
            })
        })
    })
})