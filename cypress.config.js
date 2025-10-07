const { defineConfig } = require("cypress");
const { registerArgosTask } = require("@argos-ci/cypress/task");

module.exports = defineConfig({
  projectId: "ur5j2i",
  e2e: {
    defaultCommandTimeout: 30000, // Increased from 10000 to 30000 for screenshot operations
    viewportWidth: 1920,
    viewportHeight: 1080,
    async setupNodeEvents(on, config) {
      if (config.env.argos !== false) {
        registerArgosTask(on, config, {
          uploadToArgos: true,

          buildName: "Appetiser Cypress Testing",

          token: "argos_acdbee3216bb9867e6d16461d5a3de2b33",
        });
      }
    },
  },
  env: {
    ARGOS_TOKEN: "argos_acdbee3216bb9867e6d16461d5a3de2b33",
    PERCY_TOKEN: process.env.PERCY_TOKEN || "web_673afcf23af14031fd7eb66032b1f4adaa7eb5edfa9da63f16578ae528b284ee",
    PERCY_ENABLE_INTERACTIVE: process.env.PERCY_ENABLE_INTERACTIVE || true,
  },
  experimentalMemoryManagement: true,
  pageLoadTimeout: 60000,
  responseTimeout: 240000,
  retries: {
    runMode: 2,
    openMode: 0
  }
});
