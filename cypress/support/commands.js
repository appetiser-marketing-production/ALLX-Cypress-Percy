Cypress.Commands.add('checkCampaign', () => {
    cy.wait(2000);
    cy.get('body').then(($body) => {
        if ($body.find('.Campaign__alphaLayer').length > 0) {
            cy.log('Campaign__alphaLayer FOUND');
            cy.get('.CloseButton__ButtonElement-sc-79mh24-0')
                .should('be.visible')
                .click({ force: true });
            console.log('Clicked CloseButton__ButtonElement');
        } else {
            cy.log('Campaign__alphaLayer NOT FOUND');
        }
    });
    cy.wait(2000);
});
Cypress.Commands.add('removePopup', () => {
    cy.get('body').then(($body) => {
        if ($body.find('.CampaignType--popup').length > 0) {
            cy.get('.CampaignType--popup').invoke('css', 'display', 'none')
        }
    })
});