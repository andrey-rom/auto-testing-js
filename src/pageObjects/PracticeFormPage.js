import { BasePage } from './index.js';
import { expect } from '@playwright/test';
// TODO Remove all fixed timeouts. Use explicit assertions and waits for visibility and values. Verify that the date format is compatible.
export default class PracticeFormPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.mobileInput = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.currentAddressTextarea = page.locator('#currentAddress');
    //TODO: Refactor hobbies locators to a single method with parameter
    this.genderMale = page.locator('input[value="Male"]');
    this.genderFemale = page.locator('input[value="Female"]');
    this.genderOther = page.locator('input[value="Other"]');
    //TODO: Refactor hobbies locators to a single method with parameter
    this.hobbiesSports = page.locator('input[id="hobbies-checkbox-1"]');
    this.hobbiesReading = page.locator('input[id="hobbies-checkbox-2"]');
    this.hobbiesMusic = page.locator('input[id="hobbies-checkbox-3"]');
    this.subjectsInput = page.locator('#subjectsInput');
    this.stateDropdown = page.locator('#state');
    this.cityDropdown = page.locator('#city');
    this.submitButton = page.locator('#submit');
    this.resultModal = page.locator('.modal-content');
    this.resultTable = page.locator('.table-responsive');
    this.closeButton = page.locator('#closeLargeModal');
    this.firstNameError = page.locator('#firstName:invalid');
    this.lastNameError = page.locator('#lastName:invalid');
    this.emailError = page.locator('#userEmail:invalid');
    this.mobileError = page.locator('#userNumber:invalid');
  }

  async fillFirstName(firstName) {
    await this.firstNameInput.scrollIntoViewIfNeeded();
    await this.firstNameInput.fill(firstName);
    await this.page.waitForTimeout(200);
  }

  async fillLastName(lastName) {
    await this.lastNameInput.scrollIntoViewIfNeeded();
    await this.lastNameInput.fill(lastName);
    await this.page.waitForTimeout(200);
  }

  async fillEmail(email) {
    await this.emailInput.scrollIntoViewIfNeeded();
    await this.emailInput.fill(email);
    await this.page.waitForTimeout(200);
  }

  async fillMobile(mobile) {
    await this.mobileInput.scrollIntoViewIfNeeded();
    await this.mobileInput.fill(mobile);
    await this.page.waitForTimeout(200);
  }

  async fillDateOfBirth(date) {
    await this.dateOfBirthInput.scrollIntoViewIfNeeded();
    await this.dateOfBirthInput.click();
    await this.page.waitForTimeout(300);
    await this.dateOfBirthInput.fill(date);
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async fillCurrentAddress(address) {
    await this.currentAddressTextarea.scrollIntoViewIfNeeded();
    await this.currentAddressTextarea.fill(address);
    await this.page.waitForTimeout(200);
  }

  async selectGender(gender) {
    const genderMap = {
      'Male': this.genderMale,
      'Female': this.genderFemale,
      'Other': this.genderOther,
    };
    const genderLocator = genderMap[gender];
    if (genderLocator) {
      await genderLocator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(200);
      await genderLocator.click({ force: true });
      await this.page.waitForTimeout(200);
    }
  }

  async selectHobbies(hobbies) {
    const hobbiesMap = {
      'Sports': this.hobbiesSports,
      'Reading': this.hobbiesReading,
      'Music': this.hobbiesMusic,
    };
    for (const hobby of hobbies) {
      if (hobbiesMap[hobby]) {
        await hobbiesMap[hobby].scrollIntoViewIfNeeded();
        await hobbiesMap[hobby].click({ force: true });
        await this.page.waitForTimeout(200);
      }
    }
  }

  async selectSubject(subject) {
    await this.subjectsInput.scrollIntoViewIfNeeded();
    await this.subjectsInput.fill(subject);
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(300);
  }

  async selectState(state) {
    const stateInput = this.page.locator('#state input');
    await stateInput.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await stateInput.focus();
    await this.page.waitForTimeout(300);
    await stateInput.fill(state);
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async selectCity(city) {
    await this.page.waitForTimeout(1000);
    const cityInput = this.page.locator('#city input');
    await cityInput.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await cityInput.focus();
    await this.page.waitForTimeout(300);
    await cityInput.fill(city);
    await this.page.waitForTimeout(500);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async verifyResultModal() {
    await expect(this.resultModal).toBeVisible();
  }

  async verifyResultField(fieldName, expectedValue) {
    const fieldRow = this.resultTable.locator('tr').filter({ hasText: fieldName });
    await expect(fieldRow).toContainText(expectedValue);
  }

  async closeResultModal() {
    await this.closeButton.click();
  }

  async verifyValidationError(fieldName) {
    const fieldMap = {
      'firstName': this.firstNameInput,
      'lastName': this.lastNameInput,
      'email': this.emailInput,
      'mobile': this.mobileInput,
    };
    const field = fieldMap[fieldName];
    if (field) {
      const isInvalid = await field.evaluate(el => el.validity.valid === false);
      expect(isInvalid).toBe(true);
    }
  }
}

