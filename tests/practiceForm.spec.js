import { test, expect } from '@playwright/test';
import { MainPage, PracticeFormPage } from '../src/pageObjects';
import { UserCreator } from '../src/helper';
import { AdBlock } from '../src/utils';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'load', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(500);
});

test.describe('Practice Form Tests', () => {
  test('Fill practice form with all fields and verify result', async ({ page }) => {
    const mainPage = new MainPage(page);
    const formPage = new PracticeFormPage(page);
    const user = UserCreator.createUser();

    await test.step('Navigate to Practice Form page', async () => {
      await mainPage.clickCategoryCard('Forms');
      await mainPage.clickOnElementCardList('Practice Form');
    });

    await test.step('Fill all form fields', async () => {
      await formPage.fillFirstName(user.firstName);
      await formPage.fillLastName(user.lastName);
      await formPage.fillEmail(user.email);
      await formPage.selectGender('Male');
      await formPage.fillMobile('1234567890');
      await formPage.fillDateOfBirth('15 May 1990');
      await formPage.selectSubject('Maths');
      await formPage.selectHobbies(['Sports', 'Reading']);
      await formPage.fillCurrentAddress(user.address);
      await page.waitForTimeout(500);
      await formPage.selectState('NCR');
      await page.waitForTimeout(500);
      await formPage.selectCity('Delhi');
      await page.waitForTimeout(500);
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
      await formPage.verifyResultField('Gender', 'Male');
      await formPage.verifyResultField('Mobile', '1234567890');
      await formPage.verifyResultField('Date of Birth', '15 May,1990');
      await formPage.verifyResultField('Subjects', 'Maths');
      await formPage.verifyResultField('Hobbies', 'Sports, Reading');
      await formPage.verifyResultField('Address', user.address);
      await formPage.verifyResultField('State and City', 'NCR Delhi');
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

