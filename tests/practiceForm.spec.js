import { test, expect } from '@playwright/test';
import { MainPage, PracticeFormPage } from '../src/pageObjects';
import { UserCreator } from '../src/helper';
import { AdBlock } from '../src/utils';
import TimeoutConfig from '../config/TimeoutConfig.js';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded', timeout: TimeoutConfig.PAGE_LOAD });
  // Wait for main page header to be visible instead of networkidle
  const header = page.locator('header');
  await header.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
});

test.describe('Practice Form Tests', () => {
  test('Fill practice form with all fields and verify result', async ({ page }) => {
    const mainPage = new MainPage(page);
    const formPage = new PracticeFormPage(page);
    const user = UserCreator.createUser();

    await test.step('Navigate to Practice Form page', async () => {
      await mainPage.clickCategoryCard('Forms');
      await mainPage.clickOnElementCardList('Practice Form');
      // Wait for the form page to load - ensure firstName input is visible
      await formPage.firstNameInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    });

    await test.step('Fill all form fields', async () => {
      await formPage.fillMandatoryFields(user);
      await formPage.fillDateOfBirth(user.dateOfBirth);
      await formPage.selectSubject(user.subject);
      await formPage.selectHobbies(user.hobbies);
      await formPage.fillCurrentAddress(user.address);
      await formPage.selectState(user.state);
      await formPage.selectCity(user.city);
    });

    await test.step('Submit form', async () => {
      await formPage.clickSubmit();
    });

    await test.step('Verify result modal appears', async () => {
      await formPage.verifyResultModal();
    });

    await test.step('Verify all submitted values in result', async () => {
      await formPage.verifyResultField('Student Name', `${user.firstName} ${user.lastName}`);
      await formPage.verifyResultField('Student Email', user.email);
      await formPage.verifyResultField('Gender', user.gender);
      await formPage.verifyResultField('Mobile', user.mobile);
      await formPage.verifyResultField('Date of Birth', user.dateOfBirthForVerification);
      await formPage.verifyResultField('Subjects', user.subject);
      await formPage.verifyResultField('Hobbies', user.hobbies.join(', '));
      await formPage.verifyResultField('Address', user.address);
      await formPage.verifyResultField('State and City', `${user.state} ${user.city}`);
    });

    await test.step('Close result modal', async () => {
      await formPage.closeResultModal();
    });
  });

  test('Verify mandatory field validation - negative scenario', async ({ page }) => {
    const mainPage = new MainPage(page);
    const formPage = new PracticeFormPage(page);

    await test.step('Navigate to Practice Form page', async () => {
      await mainPage.clickCategoryCard('Forms');
      await mainPage.clickOnElementCardList('Practice Form');
    });

    await test.step('Try to submit form without filling mandatory fields', async () => {
      await formPage.clickSubmit();
    });

    await test.step('Verify validation errors for mandatory fields', async () => {
      const firstNameValidity = await formPage.firstNameInput.evaluate(el => el.validity.valid);
      const lastNameValidity = await formPage.lastNameInput.evaluate(el => el.validity.valid);
      const mobileValidity = await formPage.mobileInput.evaluate(el => el.validity.valid);
      
      expect(firstNameValidity).toBe(false);
      expect(lastNameValidity).toBe(false);
      expect(mobileValidity).toBe(false);
    });
  });

  test('Verify email validation - negative scenario', async ({ page }) => {
    const mainPage = new MainPage(page);
    const formPage = new PracticeFormPage(page);

    await test.step('Navigate to Practice Form page', async () => {
      await mainPage.clickCategoryCard('Forms');
      await mainPage.clickOnElementCardList('Practice Form');
      // Wait for the form page to load - ensure email input is visible
      await formPage.emailInput.waitFor({ state: 'visible', timeout: TimeoutConfig.ELEMENT_VISIBILITY });
    });

    await test.step('Fill invalid email', async () => {
      await formPage.fillEmail('invalid-email');
    });

    await test.step('Verify email validation error', async () => {
      const emailValidity = await formPage.emailInput.evaluate(el => el.validity.valid);
      expect(emailValidity).toBe(false);
    });
  });
});

