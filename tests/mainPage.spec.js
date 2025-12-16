import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pageObjects';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoqa.com', { waitUntil: 'load', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(500);
});
test.describe('Main', () => {
  test('Has header banner', async ({ page }) => {
    const mainPage = new MainPage(page);
    const headerBanner = mainPage.headerLocator;
    await expect(headerBanner).toBeVisible();

    await test.step('Elements Card visible in main page', async () => {
      await mainPage.checkCategoryCard('Elements');
    });
    await test.step('Forms Card visible in main page', async () => {
      await mainPage.checkCategoryCard('Forms');
    });
    await test.step('Widgets Card visible in main page', async () => {
      await mainPage.checkCategoryCard('Widgets');
    });
  });
});
