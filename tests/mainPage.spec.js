import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pageObjects';
import TimeoutConfig from '../config/TimeoutConfig.js';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoqa.com', {
    waitUntil: 'domcontentloaded',
    timeout: TimeoutConfig.PAGE_LOAD
  });

  const header = page.locator('header');
  await header.waitFor({
    state: 'visible',
    timeout: TimeoutConfig.ELEMENT_VISIBILITY
  });
});

test.describe('Main', () => {
  test('Has header banner and category cards', async ({ page }) => {
    const mainPage = new MainPage(page);

    // Check Header
    await expect(mainPage.headerLocator).toBeVisible();

    await test.step('Elements Card visible in main page', async () => {
      const card = mainPage.getCategoryCard('Elements');
      await expect(card).toBeVisible();
    });

    await test.step('Forms Card visible in main page', async () => {
      const card = mainPage.getCategoryCard('Forms');
      await expect(card).toBeVisible();
    });

    await test.step('Widgets Card visible in main page', async () => {
      const card = mainPage.getCategoryCard('Widgets');
      await expect(card).toBeVisible();
    });
  });
});
