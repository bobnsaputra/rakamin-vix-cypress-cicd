describe("Purchasing with Credit Card payment method", () => {
    it("Purchase successful payment", () => {
        cy.visit('/')

        cy.get('.ss-box-inner').should('be.visible')
        cy.contains('BUY NOW').click()

        cy.get('div[class*=cart-content]').should('be.visible')
        cy.get('div[class=cart-head]').contains('Shopping Cart').should('be.visible')

        cy.inputCheckoutData()
        cy.wait(2000)

        cy.frameLoaded('#snap-midtrans')
        cy.enter('#snap-midtrans').then(getBody => {
            getBody().contains('Credit/debit card').click()

            getBody().find('div[class="card-number"]').find('input').type('4811111111111114')
            getBody().find('input[id="card-expiry"]').type('0225')
            getBody().find('input[id="card-cvv"]').type('123')
            getBody().find('label[for="no-promo"]').scrollIntoView().click()
            getBody().find('div[class="card-pay-button-part"]').find('button').click()

            cy.wait(2000)
            getBody().find('.iframe-3ds').then(body => {
                const $content = body.contents()
                cy.wrap($content).find('input[type="password"]').type('112233')
                cy.wrap($content).find('button[type="submit"]').click()
            })
        }) 

        cy.wait(4000)
        cy.get('div[class*=trans-success]').should('be.visible')
        cy.contains('Thank you for your purchase.').should('be.visible')
    })
    it("Purchase failed payment invalid CVV", () => {
        cy.visit('/')

        cy.get('.ss-box-inner').should('be.visible')
        cy.contains('BUY NOW').click()

        cy.get('div[class*=cart-content]').should('be.visible')
        cy.get('div[class=cart-head]').contains('Shopping Cart').should('be.visible')

        cy.inputCheckoutData()
        cy.wait(2000)

        cy.frameLoaded('#snap-midtrans')
        cy.enter('#snap-midtrans').then(getBody => {
            getBody().contains('Credit/debit card').click()

            getBody().find('div[class="card-number"]').find('input').type('4811111111111114')
            getBody().find('input[id="card-expiry"]').type('0225')
            getBody().find('input[id="card-cvv"]').type('555555')
            getBody().find('label[for="no-promo"]').scrollIntoView().click()
            getBody().find('div[class="card-pay-button-part"]').find('button').click()

            cy.wait(2000)
            getBody().find('.cancel-modal-content').should('be.visible')
            getBody().find('.cancel-modal-title').should('have.text', 'Payment data is invalid')
            getBody().find('.cancel-modal-subtitle').should('have.text', 'Your transaction failed to be processed. Please retry.')
        }) 
    })
})