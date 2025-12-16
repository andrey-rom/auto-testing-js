import { BasePage } from './index.js';
import { expect } from '@playwright/test';

export default class ToolTipsPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.hoverMeButton = page.locator('#toolTipButton');
    this.hoverMeInput = page.locator('#toolTipTextField');
    this.hoverMeLink = page.locator('a[href="javascript:void(0)"]').first();
    this.tooltip = page.locator('.tooltip-inner');
  }

  async hoverOverButton() {
    await this.hoverMeButton.hover();
    await this.page.waitForTimeout(500);
  }

  async hoverOverInput() {
    await this.hoverMeInput.hover();
    await this.page.waitForTimeout(500);
  }

  async hoverOverLink() {
    await this.hoverMeLink.hover();
    await this.page.waitForTimeout(500);
  }

  async verifyTooltipText(expectedText) {
    const tooltipLocator = this.page.locator('.tooltip-inner').filter({ hasText: expectedText });
    await tooltipLocator.waitFor({ state: 'visible', timeout: 5000 });
    await expect(tooltipLocator).toBeVisible();
    await expect(tooltipLocator).toContainText(expectedText);
  }

  async getTooltipText() {
    await this.tooltip.waitFor({ state: 'visible' });
    return await this.tooltip.textContent();
  }
}

