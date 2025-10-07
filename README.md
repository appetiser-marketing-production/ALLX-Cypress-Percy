# ALLX-Cypress

End-to-end Cypress test suite for the ALLX project.

## Running Tests

### Run Tests by Folder

```sh
npx cypress run --runner-ui --spec "cypress/e2e/daily-test/argos/*"
npx cypress run --runner-ui --spec "cypress/e2e/daily-test/check-navigation/*"
npx cypress run --runner-ui --spec "cypress/e2e/daily-test/check-site-elements/*"
npx cypress run --runner-ui --spec "cypress/e2e/daily-test/check-site-elements/check-google-tags.cy.js"
npx cypress run --runner-ui --spec "cypress/e2e/monthly-test/*"
```

### Run Cypress in BuddyWorks (CI)

```sh
apt-get update
apt-get install -y libasound2
export ALSA_CONFIG_PATH=/dev/null
git init
git checkout main
npm ci
npx cypress run --runner-ui --spec "cypress/e2e/check-site-elements/*"
```

### Open Cypress UI

```sh
npx cypress open
```

### Run All Cypress Tests (CLI)

```sh
npx cypress run
```

### Run Daily, Dev, Local, and Monthly Test Suites

**Daily (with Percy Visual Testing):**
```sh
# Set Percy token (Windows PowerShell)
$env:PERCY_TOKEN="web_673afcf23af14031fd7eb66032b1f4adaa7eb5edfa9da63f16578ae528b284ee"

# Run specific Percy test
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/argos/contact-us-argos.cy.js"

# Run all daily tests with Percy
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/argos/*"
```

**Dev:**
```sh
npx cypress run --runner-ui --spec "cypress/e2e/dev-test/*/*" --env argos=false
```

**Local:**
```sh
npx cypress run --runner-ui --spec "cypress/e2e/local-test/*/*" --env argos=false
```

**Monthly:**
```sh
npx cypress run --runner-ui --spec "cypress/e2e/monthly-test/*"
```

### Percy Visual Testing

This project includes Percy visual regression testing integration. Percy captures screenshots of your application across different viewports and compares them to detect visual changes.

**Prerequisites:**
- Percy token is configured in `cypress.config.js`
- `@percy/cypress` package is installed
- Percy import is added to `cypress/support/e2e.js`

**Running Percy Tests:**
```sh
# Run a specific test with Percy
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/argos/contact-us-argos.cy.js"

# Run all Argos tests with Percy (recommended)
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/argos/*"

# Run all daily tests with Percy
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/*"

# Run specific test suites
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/argos/homepage-argos.cy.js"
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/argos/blog-argos.cy.js"
npx percy exec -- cypress run --spec "cypress/e2e/daily-test/argos/portfolio-argos.cy.js"
```

**View Results:**
- Visit your Percy dashboard to review visual snapshots
- Compare builds to detect visual changes
- Approve or reject visual changes as needed
