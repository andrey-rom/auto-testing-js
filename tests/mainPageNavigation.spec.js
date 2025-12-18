import { expect, test } from '@playwright/test';
import { AdBlock, Randomizer } from '../src/utils/index.js';
import { MainPage } from '../src/pageObjects/index.js';
import data from '../config/Constants.js';
import TimeoutConfig from '../config/TimeoutConfig.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', {
    waitUntil: 'domcontentloaded',
    timeout: TimeoutConfig.PAGE_LOAD
  });
  const header = page.locator('header');
  await header.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
});

test('Check navigation', async ({ page }) => {
  const mainPage = new MainPage(page);
  const randomColor = Randomizer.randomValueFromArray(data.colors);

  await test.step('Click on "Elements" card', async () => {
    await mainPage.clickCategoryCard('Elements');
  });

  await test.step('Check "Elements" section is expanded', async () => {
    const elementsBody = mainPage.getSectionBody('Elements');
    await expect(elementsBody).toHaveClass(/show/);
  });

  await test.step('Close "Elements" Section', async () => {
    await mainPage.clickGroupHeader('Elements');
  });

  await test.step('Check "Elements" section is collapsed', async () => {
    const elementsBody = mainPage.getSectionBody('Elements');
    await expect(elementsBody).not.toHaveClass(/show/);

    const widgetsBody = mainPage.getSectionBody('Widgets');
    await expect(widgetsBody).not.toHaveClass(/show/);
  });

  await test.step('Close "Widgets" Section', async () => {
    const widgetsHeader = mainPage.getSectionHeader('Widgets');
    await widgetsHeader.scrollIntoViewIfNeeded();
    await widgetsHeader.click();
  });

  await test.step('Check "Widgets" section is expanded', async () => {
    const widgetsBody = mainPage.getSectionBody('Widgets');
    await expect(widgetsBody).toHaveClass(/show/);
  });

  await test.step('Open "Auto Complete" Section', async () => {
    await mainPage.clickGroupElement('Auto Complete');
  });

  await test.step('Fill Multiple colors', async () => {
    await mainPage.selectMultipleColor(randomColor);
  });

  await test.step('Check selected value', async () => {
    await mainPage.checkMultipleColorValue(randomColor);
  });
});
