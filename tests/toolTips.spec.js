import { test } from '@playwright/test';
import { MainPage, ToolTipsPage } from '../src/pageObjects';
import { AdBlock } from '../src/utils';
import TimeoutConfig from '../config/TimeoutConfig.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded', timeout: TimeoutConfig.PAGE_LOAD });
  // Wait for main page header to be visible instead of networkidle
  const header = page.locator('header');
  await header.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
});

test.describe('Tool Tips Tests', () => {
  test('Check text on all tooltips', async ({ page }) => {
    const mainPage = new MainPage(page);
    const toolTipsPage = new ToolTipsPage(page);

    await test.step('Navigate to Tool Tips page', async () => {
      await mainPage.clickCategoryCard('Widgets');
      await mainPage.clickOnElementCardList('Tool Tips');
    });

    await test.step('Hover over button and verify tooltip', async () => {
      await toolTipsPage.hoverOverButton();
      await toolTipsPage.verifyTooltipText('You hovered over the Button');
    });

    await test.step('Hover over input field and verify tooltip', async () => {
      await toolTipsPage.hoverOverInput();
      await toolTipsPage.verifyTooltipText('You hovered over the text field');
    });

    await test.step('Hover over link and verify tooltip', async () => {
      await toolTipsPage.hoverOverLink();
      await toolTipsPage.verifyTooltipText('You hovered over the Contrary');
    });
  });
});
