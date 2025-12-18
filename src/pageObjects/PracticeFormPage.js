import { BasePage } from './index.js';
import { expect } from '@playwright/test';
import TimeoutConfig from '../../config/TimeoutConfig.js';

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
    this.genderMale = page.locator('input[value="Male"]');
    this.genderFemale = page.locator('input[value="Female"]');
    this.genderOther = page.locator('input[value="Other"]');
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

  /**
   * Get hobby locator by hobby name
   * @param {string} hobbyName - Name of the hobby (Sports, Reading, or Music)
   * @returns {Locator} Playwright locator for the hobby checkbox
   */
  getHobbyLocator(hobbyName) {
    const hobbyMap = {
      'Sports': this.page.locator('input[id="hobbies-checkbox-1"]'),
      'Reading': this.page.locator('input[id="hobbies-checkbox-2"]'),
      'Music': this.page.locator('input[id="hobbies-checkbox-3"]'),
    };
    return hobbyMap[hobbyName];
  }

  async fillFirstName(firstName) {
    await this.firstNameInput.scrollIntoViewIfNeeded();
    await this.firstNameInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.firstNameInput.fill(firstName);
    await expect(this.firstNameInput).toHaveValue(firstName);
  }

  async fillLastName(lastName) {
    await this.lastNameInput.scrollIntoViewIfNeeded();
    await this.lastNameInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.lastNameInput.fill(lastName);
    await expect(this.lastNameInput).toHaveValue(lastName);
  }

  async fillEmail(email) {
    await this.emailInput.scrollIntoViewIfNeeded();
    await this.emailInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.emailInput.fill(email);
    await expect(this.emailInput).toHaveValue(email);
  }

  async fillMobile(mobile) {
    await this.mobileInput.scrollIntoViewIfNeeded();
    await this.mobileInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.mobileInput.fill(mobile);
    await expect(this.mobileInput).toHaveValue(mobile);
  }

  async fillDateOfBirth(date) {
    await this.dateOfBirthInput.scrollIntoViewIfNeeded();
    await this.dateOfBirthInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.dateOfBirthInput.click();
    await this.dateOfBirthInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.dateOfBirthInput.fill(date);
    await this.dateOfBirthInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.page.keyboard.press('Enter');
    // Wait for date picker to close and value to be set
    await expect(this.dateOfBirthInput).not.toHaveValue('');
  }

  async fillCurrentAddress(address) {
    await this.currentAddressTextarea.scrollIntoViewIfNeeded();
    await this.currentAddressTextarea.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.currentAddressTextarea.fill(address);
    await expect(this.currentAddressTextarea).toHaveValue(address);
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
      await genderLocator.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
      await genderLocator.click({ force: true });
      // Verify gender is selected
      await expect(genderLocator).toBeChecked();
    }
  }

  async selectHobbies(hobbies) {
    for (const hobby of hobbies) {
      const hobbyLocator = this.getHobbyLocator(hobby);
      if (hobbyLocator) {
        await hobbyLocator.scrollIntoViewIfNeeded();
        await hobbyLocator.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
        await hobbyLocator.click({ force: true });
        // Verify hobby is selected
        await expect(hobbyLocator).toBeChecked();
      }
    }
  }

  async selectSubject(subject) {
    await this.subjectsInput.scrollIntoViewIfNeeded();
    await this.subjectsInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.subjectsInput.fill(subject);
    // Wait for autocomplete dropdown to appear
    const option = this.page.locator(`div[id*="option"]`).filter({ hasText: subject }).first();
    await option.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.page.keyboard.press('Enter');
    // Verify subject is selected by checking for the tag/chip element (subjects are displayed as chips, not in input value)
    const subjectChip = this.page.locator('.subjects-auto-complete__multi-value__label').filter({ hasText: subject });
    await subjectChip.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
  }

  async selectState(state) {
    const stateInput = this.page.locator('#state input');
    await stateInput.scrollIntoViewIfNeeded();
    await stateInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await stateInput.focus();
    await stateInput.fill(state);
    // Wait for dropdown option to appear
    const stateOption = this.page.locator(`div[id*="option"]`).filter({ hasText: state }).first();
    await stateOption.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.page.keyboard.press('Enter');
    // Wait for state to be selected and city dropdown to be enabled
    await this.cityDropdown.locator('input').waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
  }

  async selectCity(city) {
    const cityInput = this.page.locator('#city input');
    await cityInput.scrollIntoViewIfNeeded();
    await cityInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await cityInput.focus();
    await cityInput.fill(city);
    // Wait for dropdown option to appear
    const cityOption = this.page.locator(`div[id*="option"]`).filter({ hasText: city }).first();
    await cityOption.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.page.keyboard.press('Enter');
    // Verify city is selected by checking the dropdown text content (city input clears after selection)
    await this.cityDropdown.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    const dropdownText = await this.cityDropdown.textContent();
    expect(dropdownText).toContain(city);
  }

  /**
   * Fill all mandatory fields of the practice form
   * @param {Object} userData - User data object with firstName, lastName, email, mobile, gender
   */
  async fillMandatoryFields(userData) {
    await this.fillFirstName(userData.firstName);
    await this.fillLastName(userData.lastName);
    await this.fillEmail(userData.email);
    await this.fillMobile(userData.mobile);
    await this.selectGender(userData.gender);
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async verifyResultModal() {
    await expect(this.resultModal).toBeVisible({ timeout: TimeoutConfig.ELEMENT_VISIBILITY });
  }

  async verifyResultField(fieldName, expectedValue) {
    const fieldRow = this.resultTable.locator('tr').filter({ hasText: fieldName });
    await expect(fieldRow).toBeVisible({ timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    await expect(fieldRow).toContainText(expectedValue);
  }

  async closeResultModal() {
    await this.closeButton.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
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
      await field.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
      const isInvalid = await field.evaluate(el => el.validity.valid === false);
      expect(isInvalid).toBe(true);
    }
  }
}
