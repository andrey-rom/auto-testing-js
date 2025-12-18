import BasePage from './BasePage.js';
import TimeoutConfig from '../../config/TimeoutConfig.js';

export default class MainPage extends BasePage {
  constructor(page) {
    super(page);
    this.headerLocator = page.locator('header');
    this.multiselectField = page.locator('#autoCompleteMultipleContainer input');
    this.multiValueLabel = page.locator('.auto-complete__multi-value__label');
  }

  getCategoryCard(cardName) {
    return this.page.locator('.card', { hasText: cardName });
  }

  getSectionHeader(groupName) {
    return this.page.locator('.header-text', { hasText: groupName });
  }

  getSectionBody(groupName) {
    return this.page.locator('.element-group', { hasText: groupName }).locator('.element-list');
  }

  getOptionInList(option) {
    return this.page.locator('.auto-complete__option', { hasText: option });
  }

  async clickCategoryCard(category) {
    const card = this.getCategoryCard(category);
    await card.scrollIntoViewIfNeeded();
    await card.click();
  }

  async clickOnElementCardList(element) {
    const elementInList = this.page.locator('li', { hasText: element });
    await elementInList.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await elementInList.click();
  }

  async clickGroupHeader(groupName) {
    const groupHeader = this.getSectionHeader(groupName);
    await groupHeader.scrollIntoViewIfNeeded();
    await groupHeader.click();
  }

  async clickGroupElement(elementName) {
    const groupElement = this.page.locator('span', { hasText: elementName });
    await groupElement.scrollIntoViewIfNeeded();
    await groupElement.click();
  }

  async selectMultipleColor(option) {
    await this.multiselectField.fill(option);
    const optionToSelect = this.getOptionInList(option);
    await optionToSelect.click();
  }

  async checkMultipleColorValue(expectedValue) {
    await this.multiValueLabel.filter({ hasText: expectedValue }).waitFor({ state: 'visible' });
  }
}
