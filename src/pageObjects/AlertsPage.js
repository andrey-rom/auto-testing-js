import { BasePage } from './index.js';
import { expect } from '@playwright/test';

export default class AlertsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.selectors = {
      alertButton: page.locator('#alertButton'),
      confirmButton: page.locator('#confirmButton'),
      promptButton: page.locator('#promtButton'),
      confirmResult: page.locator('#confirmResult'),
      promptResult: page.locator('#promptResult'),
    };
  }

  async clickAlertButtonByType(buttonSelector) {
    const button = this.selectors[buttonSelector];
    await button.waitFor({ state: 'visible' });
    await button.click();
  }

  async verifyConfirmResult(expectedText) {
    await expect(this.selectors.confirmResult).toContainText(expectedText);
  }

  async verifyPromptResult(expectedText) {
    await expect(this.selectors.promptResult).toContainText(expectedText);
  }
}
