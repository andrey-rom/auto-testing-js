import { BasePage } from './index.js';
import { DataStorage, UserCreator } from '../helper/index.js';

export default class TextBoxPage extends BasePage {
  constructor(page) {
    super(page);
    this.fullNameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressTextarea = page.locator('#currentAddress');
    this.permanentAddressTextarea = page.locator('#permanentAddress');
    this.submitButton = page.locator('//button[@id="submit"]');

    this.outputContainer = page.locator('#output');
    this.outputName = page.locator('#output #name');
    this.outputEmail = page.locator('#output #email');
    this.outputCurrentAddress = page.locator('#output #currentAddress');
    this.outputPermanentAddress = page.locator('#output #permanentAddress');
  }

  async fillTextBoxFields(userName, userNumber) {
    const user = UserCreator.createUser();
    await DataStorage.setNamespace(userName, userNumber, user);
    await this.fullNameInput.fill(user.fullName);
    await this.emailInput.fill(user.email);
    await this.currentAddressTextarea.fill(user.address);
    await this.permanentAddressTextarea.fill(user.addressAnother);
  }

  async clickSubmitButton() {
    const button = this.submitButton;
    await button.waitFor({ state: 'visible' });
    await button.click();
  }
}
