import { BasePage } from './index.js';
import { expect } from '@playwright/test';
import TimeoutConfig from '../../config/TimeoutConfig.js';

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
    await this.selectValueDropdown.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.selectValueDropdown.click({ force: true });
    await this.selectValueInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    const searchText = `${group} ${option}`;
    await this.selectValueInput.fill(searchText);
    // Wait a moment for React Select to filter and show options
    await this.page.waitForTimeout(500);
    // Press Enter to select the filtered option
    await this.page.keyboard.press('Enter');
    // Wait for selection to be applied
    await this.page.waitForTimeout(300);
    // Verify selection by checking the dropdown contains the option text
    await this.selectValueDropdown.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    const dropdownText = await this.selectValueDropdown.textContent();
    expect(dropdownText).toContain(option);
  }

  async verifySelectedValue(expectedText) {
    await this.selectValueDropdown.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    const selectedText = await this.selectValueDropdown.textContent();
    expect(selectedText.replace(/,/g, '')).toContain(expectedText.replace(/,/g, ''));
  }

  async selectOneOption(option) {
    await this.selectOneDropdown.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.selectOneDropdown.click();
    await this.selectOneInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.selectOneInput.fill(option);
    // Wait for dropdown option to appear
    const optionLocator = this.page.locator(`div[id*="option"]`).filter({ hasText: option }).first();
    await optionLocator.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.page.keyboard.press('Enter');
    // Verify selection
    await expect(this.selectOneDropdown).toContainText(option);
  }

  async verifySelectedOne(expectedText) {
    await this.selectOneDropdown.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    const selectedText = await this.selectOneDropdown.textContent();
    expect(selectedText).toContain(expectedText);
  }

  async selectOldStyleOption(option) {
    await this.oldStyleSelect.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.oldStyleSelect.selectOption(option);
    // Verify selection
    const selectedValue = await this.oldStyleSelect.inputValue();
    expect(selectedValue).toBe(option);
  }

  async verifyOldStyleSelection(expectedValue) {
    await this.oldStyleSelect.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    const selectedValue = await this.oldStyleSelect.inputValue();
    expect(selectedValue).toBe(expectedValue);
  }

  async selectMultipleOptions(options) {
    const multiselectInput = this.page.locator('input[id*="react-select-4"]');
    await multiselectInput.scrollIntoViewIfNeeded();
    await multiselectInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    
    for (const option of options) {
      await multiselectInput.focus();
      await multiselectInput.fill(option);
      // Wait for dropdown option to appear
      const optionLocator = this.page.locator(`div[id*="option"]`).filter({ hasText: option }).first();
      await optionLocator.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
      await this.page.keyboard.press('Enter');
      // Verify option is selected
      const container = this.page.locator('#selectMenuContainer');
      await expect(container).toContainText(option);
    }
    
    await this.page.keyboard.press('Escape');
    // Verify all selections are present
    const container = this.page.locator('#selectMenuContainer');
    await container.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
  }

  async verifyMultipleSelections(expectedOptions) {
    const container = this.page.locator('#selectMenuContainer');
    await container.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    const selectedText = await container.textContent();
    for (const option of expectedOptions) {
      expect(selectedText.toLowerCase()).toContain(option.toLowerCase());
    }
  }
}
