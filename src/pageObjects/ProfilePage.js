import BasePage from './BasePage.js';
import { runtimeConfig } from '../config/runtimeConfig.js';

export default class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.url = `${runtimeConfig.baseUrl}/profile`;
    this.selectors = {
      booksTable: '.rt-table',
      bookRows: '.rt-tbody .rt-tr',
      bookTitle: '.rt-td:nth-child(2)',
      noBooksMessage: '.rt-noData',
    };
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async waitForBooksTable() {
    try {
      await Promise.race([
        this.page.waitForSelector(this.selectors.booksTable, { timeout: runtimeConfig.timeouts.selector }),
        this.page.waitForSelector(this.selectors.noBooksMessage, { timeout: runtimeConfig.timeouts.selector }),
      ]);
    } catch (error) {
      if (this.page.isClosed()) {
        throw new Error('Page has been closed');
      }
    }
  }

  async getBookTitles() {
    const noBooksVisible = await this.isNoBooksMessageVisible();
    if (noBooksVisible) {
      return [];
    }
    
    await this.waitForBooksTable();
    const rows = await this.page.locator(this.selectors.bookRows).all();
    const titles = [];
    
    for (const row of rows) {
      const titleElement = row.locator(this.selectors.bookTitle);
      if (await titleElement.isVisible()) {
        const title = await titleElement.textContent();
        if (title && title.trim()) {
          titles.push(title.trim());
        }
      }
    }
    
    return titles;
  }

  async isBookInCollection(bookTitle) {
    const titles = await this.getBookTitles();
    return titles.includes(bookTitle);
  }

  async getBookCount() {
    await this.waitForBooksTable();
    const titles = await this.getBookTitles();
    return titles.length;
  }

  async isNoBooksMessageVisible() {
    try {
      await this.page.waitForSelector(this.selectors.noBooksMessage, { timeout: runtimeConfig.timeouts.selector });
      return await this.page.isVisible(this.selectors.noBooksMessage);
    } catch {
      return false;
    }
  }

  async refresh() {
    if (this.page.isClosed()) {
      throw new Error('Cannot refresh: page has been closed');
    }
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForBooksTable();
  }
}
