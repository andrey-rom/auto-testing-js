import { expect, test } from '@playwright/test';
import { AdBlock } from '../src/utils/index.js';
import { TextBoxPage } from '../src/pageObjects/index.js';
import { DataStorage } from '../src/helper/index.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com/text-box', { waitUntil: 'domcontentloaded' });
});

test('Fill text box', async ({ page }) => {
  const textBoxPage = new TextBoxPage(page);
  await textBoxPage.fillTextBoxFields('USER', 1);

  await test.step('submit form', async () => {
    await textBoxPage.clickSubmitButton();
  });

  await test.step('Check fields', async () => {
    const userNameFromStorage = DataStorage.getNamespace('USER', 1).firstName;
    const outputSection = textBoxPage.outputContainer;
    console.log(userNameFromStorage);
    await expect(outputSection).toContainText(userNameFromStorage);
  });
});
