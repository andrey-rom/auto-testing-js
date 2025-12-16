import { BasePage } from './index.js';
import { expect } from '@playwright/test';

export default class SelectMenuPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.selectValueDropdown = page.locator('#withOptGroup');
    this.selectValueInput = page.locator('#withOptGroup input');
    this.selectOneDropdown = page.locator('#selectOne');
    this.selectOneInput = page.locator('#selectOne input');
    this.oldStyleSelect = page.locator('#oldSelectMenu');
    this.standardMultiSelect = page.locator('#cars');
    this.multiselectDropdown = page.locator('#react-select-4-input');
  }

  async selectValueOption(group, option) {
    await this.selectValueDropdown.click({ force: true });
    await this.page.waitForTimeout(500);
    await this.selectValueInput.fill(`${group} ${option}`);
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(200);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async verifySelectedValue(expectedText) {
    await this.page.waitForTimeout(500);
    const selectedText = await this.selectValueDropdown.textContent();
    expect(selectedText.replace(/,/g, '')).toContain(expectedText.replace(/,/g, ''));
  }

  async selectOneOption(option) {
    await this.selectOneDropdown.click();
    await this.selectOneInput.fill(option);
    await this.page.keyboard.press('Enter');
  }

  async verifySelectedOne(expectedText) {
    const selectedText = await this.selectOneDropdown.textContent();
    expect(selectedText).toContain(expectedText);
  }

  async selectOldStyleOption(option) {
    await this.oldStyleSelect.selectOption(option);
  }

  async verifyOldStyleSelection(expectedValue) {
    const selectedValue = await this.oldStyleSelect.inputValue();
    expect(selectedValue).toBe(expectedValue);
  }

  async selectMultipleOptions(options) {
    const multiselectInput = this.page.locator('input[id*="react-select-4"]');
    await multiselectInput.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    for (const option of options) {
      await multiselectInput.focus();
      await this.page.waitForTimeout(300);
      await multiselectInput.fill(option);
      await this.page.waitForTimeout(500);
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(500);
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }

  async verifyMultipleSelections(expectedOptions) {
    await this.page.waitForTimeout(1000);
    const container = this.page.locator('#selectMenuContainer');
    const selectedText = await container.textContent();
    for (const option of expectedOptions) {
      expect(selectedText.toLowerCase()).toContain(option.toLowerCase());
    }
  }
}

