import { expect, test } from '@playwright/test';
import { AdBlock, Randomizer } from '../src/utils/index.js';
import { MainPage } from '../src/pageObjects/index.js';
import data from '../config/Constants.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'load', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(500);
});

/**
 * Test Case: Click on category card
 * steps:
 * 1. Navigate to the main page.
 * 2. Click on the "Elements" category card.
 * 3. Verify that the "Elements" section is expanded.
 * 4. Check that another sections are collapsed.
 * 5. Check another category card sections (e.g., "Forms").
 */

test('Check navigation', async ({ page }) => {
  const mainPage = await new MainPage(page);
  const randomColor = Randomizer.randomValueFromArray(data.colors);
  await test.step('Click on "Elements" card', async () => {
    await mainPage.clickCategoryCard('Elements');
  });

  await test.step('Check "Elements" section is expanded', async () => {
    const isExpanded = await mainPage.checkSectionIsExpanded('Elements');
    expect(isExpanded).toBeTruthy();
  });

  await test.step('Close "Elements" Section', async () => {
    await mainPage.clickGroupHeader('Elements');
  });

  await test.step('Check "Elements" section is collapsed', async () => {
    const isExpanded = await mainPage.checkSectionIsExpanded('Elements');
    expect(isExpanded).toBeFalsy();
    const isWidgetsExpanded = await mainPage.checkSectionIsExpanded('Widgets');
    expect(isWidgetsExpanded).toBeFalsy();
  });

  await test.step('Close "Widgets" Section', async () => {
    await mainPage.clickGroupHeader('Widgets');
  });

  await test.step('Check "Widgets" section is expanded', async () => {
    const isExpanded = await mainPage.checkSectionIsExpanded('Widgets');
    expect(isExpanded).toBeTruthy();
  });

  await test.step('Open "Auto Complete" Section', async () => {
    await mainPage.clickGroupElement('Auto Complete');
  });

  await test.step('Fill Multiple colors', async () => {
    await mainPage.selectMultipleColor(randomColor);
  });

  await test.step('Check selected value', async () => {
    await mainPage.checkMultipleColorValue(randomColor);
    console.log(randomColor);
  });
});
