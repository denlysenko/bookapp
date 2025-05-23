import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

const cypressJsonConfig = {
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  video: true,
  videosFolder: '../../../dist/cypress/apps/react/desktop-e2e/videos',
  screenshotsFolder: '../../../dist/cypress/apps/react/desktop-e2e/screenshots',
  chromeWebSecurity: false,
  specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
  supportFile: 'src/support/e2e.ts',
};

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    ...cypressJsonConfig,
    setupNodeEvents(on) {
      on('task', {
        seedDatabase() {
          const { execSync } = require('child_process');
          const path = require('path');
          // Navigate to root directory (3 levels up from current e2e directory)
          const rootDir = path.resolve(__dirname, '../../../');

          execSync('npm run seed:db', {
            cwd: rootDir,
            encoding: 'utf8',
            stdio: 'pipe',
          });

          return true;
        },
      });
    },
  },
});
