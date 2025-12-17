import { test } from '@playwright/test';
import { MainPage, SelectMenuPage } from '../src/pageObjects';
import { AdBlock } from '../src/utils';
// TODO Prefer waiting for visible selectors over networkidle and timeouts. Don't silently ignore navigation load errors—handle or report them.
test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'load', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(500);
});


test.describe('Select Menu Tests', () => {
  test('Cover functionality with all dropdowns', async ({ page }) => {
    const mainPage = new MainPage(page);
    const selectMenuPage = new SelectMenuPage(page);

    await test.step('Navigate to Select Menu page', async () => {
      await mainPage.clickCategoryCard('Widgets');
      await mainPage.clickOnElementCardList('Select Menu');
    });

    await test.step('Select Value - Group 2, option 1', async () => {
      await selectMenuPage.selectValueOption('Group 2', 'option 1');
      await selectMenuPage.verifySelectedValue('Group 2, option 1');
    });

    await test.step('Select One - Other', async () => {
      await selectMenuPage.selectOneOption('Other');
      await selectMenuPage.verifySelectedOne('Other');
    });

    await test.step('Old Style Select Menu - Green', async () => {
      await selectMenuPage.selectOldStyleOption('3');
      await selectMenuPage.verifyOldStyleSelection('3');
    });

    await test.step('Multiselect drop down - Black, Blue', async () => {
      await selectMenuPage.selectMultipleOptions(['Black', 'Blue']);
      await selectMenuPage.verifyMultipleSelections(['Black', 'Blue']);
    });
  });
});

