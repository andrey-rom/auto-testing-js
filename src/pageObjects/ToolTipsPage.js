import { BasePage } from './index.js';
import { expect } from '@playwright/test';
import TimeoutConfig from '../../config/TimeoutConfig.js';

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
    await this.hoverMeButton.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.hoverMeButton.hover();
    // Wait for tooltip to appear
    await this.tooltip.waitFor({ state: 'visible', timeout: TimeoutConfig.TOOLTIP });
  }

  async hoverOverInput() {
    await this.hoverMeInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.hoverMeInput.hover();
    // Wait for tooltip to appear
    await this.tooltip.waitFor({ state: 'visible', timeout: TimeoutConfig.TOOLTIP });
  }

  async hoverOverLink() {
    await this.hoverMeLink.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.hoverMeLink.hover();
    // Wait for specific tooltip to appear (filter by expected text to avoid strict mode violation)
    const linkTooltip = this.tooltip.filter({ hasText: 'Contrary' });
    await linkTooltip.waitFor({ state: 'visible', timeout: TimeoutConfig.TOOLTIP });
  }

  async verifyTooltipText(expectedText) {
    const tooltipLocator = this.page.locator('.tooltip-inner').filter({ hasText: expectedText });
    await tooltipLocator.waitFor({ state: 'visible', timeout: TimeoutConfig.TOOLTIP });
    await expect(tooltipLocator).toBeVisible();
    await expect(tooltipLocator).toContainText(expectedText);
  }

  async getTooltipText() {
    await this.tooltip.waitFor({ state: 'visible', timeout: TimeoutConfig.TOOLTIP });
    return await this.tooltip.textContent();
  }
}
