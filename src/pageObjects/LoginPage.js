import BasePage from './BasePage.js';
import { runtimeConfig } from '../config/runtimeConfig.js';

export default class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = `${runtimeConfig.baseUrl}/login`;
    this.selectors = {
      userNameInput: '#userName',
      passwordInput: '#password',
      loginButton: '#login',
      errorMessage: '#name',
    };
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async fillLoginForm(userName, password) {
    await this.page.fill(this.selectors.userNameInput, userName);
    await this.page.fill(this.selectors.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(this.selectors.loginButton);
  }

  async login(userName, password) {
    await this.fillLoginForm(userName, password);
    await this.clickLogin();
  }

  async isErrorMessageVisible() {
    try {
      await this.page.waitForSelector(this.selectors.errorMessage, { timeout: 2000 });
      return await this.page.isVisible(this.selectors.errorMessage);
    } catch {
      return false;
    }
  }
}
