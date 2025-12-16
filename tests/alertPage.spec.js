import { test, expect } from '@playwright/test';
import { AlertsPage, MainPage } from '../src/pageObjects';
import { AdBlock } from '../src/utils';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'load', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(500);
});

test.describe('Check Alert Page', async () => {
  test('Handle all alert types', async ({ page }) => {
    const mainPage = new MainPage(page);
    const alertPage = new AlertsPage(page);
    
    await test.step('Navigate to Alerts page', async () => {
      await mainPage.clickCategoryCard('Alerts, Frame & Windows');
      await mainPage.clickOnElementCardList('Alerts');
    });

    await test.step('Handle simple alert', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('You clicked a button');
        await dialog.accept();
      });
      await alertPage.clickAlertButtonByType('alertButton');
    });

    await test.step('Handle confirm alert - accept', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe('Do you confirm action?');
        await dialog.accept();
      });
      await alertPage.clickAlertButtonByType('confirmButton');
      await alertPage.verifyConfirmResult('You selected Ok');
    });

    await test.step('Handle confirm alert - dismiss', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        await dialog.dismiss();
      });
      await alertPage.clickAlertButtonByType('confirmButton');
      await alertPage.verifyConfirmResult('You selected Cancel');
    });

    await test.step('Handle prompt alert - with text', async () => {
      const testText = 'Test User';
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Please enter your name');
        await dialog.accept(testText);
      });
      await alertPage.clickAlertButtonByType('promptButton');
      await alertPage.verifyPromptResult(`You entered ${testText}`);
    });

    await test.step('Handle prompt alert - dismiss', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        await dialog.dismiss();
      });
      await alertPage.clickAlertButtonByType('promptButton');
      await page.waitForTimeout(1000);
      const resultExists = await alertPage.selectors.promptResult.isVisible().catch(() => false);
      if (resultExists) {
        const resultText = await alertPage.selectors.promptResult.textContent();
        expect(resultText).not.toContain('You entered');
      }
    });
  });
});
