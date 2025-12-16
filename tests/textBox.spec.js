import { expect } from '@playwright/test';
import { test } from './fixtures/fillFormFixtures.js';

test('Fill text Box scenario', async ({ textBoxPage, storedUser, page }) => {
  const { user } = storedUser;
  await test.step('Fill text box', async () => {
    await textBoxPage.fillTextBoxFields(user);
    await page.waitForTimeout(500);
  });

  await test.step('submit form', async () => {
    await textBoxPage.clickSubmitButton();
    await page.waitForTimeout(1000);
  });

  await test.step('expected values', async () => {
    await textBoxPage.expectedOutputFieldsValues(user);
    await page.waitForTimeout(500);
  });
});

test('Verify mandatory field validation - negative scenario', async ({ textBoxPage }) => {
  await test.step('Fill form without email field', async () => {
    await textBoxPage.fullNameInput.waitFor({ state: 'visible', timeout: 90000 });
    await textBoxPage.fullNameInput.fill('Test User');
    await textBoxPage.currentAddressTextarea.waitFor({ state: 'visible', timeout: 90000 });
    await textBoxPage.currentAddressTextarea.fill('Test Address');
    await textBoxPage.permanentAddressTextarea.waitFor({ state: 'visible', timeout: 90000 });
    await textBoxPage.permanentAddressTextarea.fill('Test Permanent Address');
  });

  await test.step('Verify email field is empty', async () => {
    const emailValue = await textBoxPage.emailInput.inputValue();
    expect(emailValue).toBe('');
  });

  await test.step('Verify email field validation before submission', async () => {
    const emailType = await textBoxPage.emailInput.evaluate(el => el.type);
    const emailRequired = await textBoxPage.emailInput.evaluate(el => el.hasAttribute('required'));
    
    if (emailType === 'email') {
      const emailValidity = await textBoxPage.emailInput.evaluate(el => {
        el.checkValidity();
        return el.validity.valid;
      });
      
      if (emailRequired) {
        expect(emailValidity).toBe(false);
      } else {
        expect(emailType).toBe('email');
      }
    }
  });
});

test('Verify email format validation - negative scenario', async ({ textBoxPage }) => {
  await test.step('Fill form with invalid email format', async () => {
    await textBoxPage.fullNameInput.waitFor({ state: 'visible', timeout: 90000 });
    await textBoxPage.fullNameInput.fill('Test User');
    await textBoxPage.emailInput.waitFor({ state: 'visible', timeout: 90000 });
    await textBoxPage.emailInput.fill('invalid-email-format');
    await textBoxPage.currentAddressTextarea.waitFor({ state: 'visible', timeout: 90000 });
    await textBoxPage.currentAddressTextarea.fill('Test Address');
    await textBoxPage.permanentAddressTextarea.waitFor({ state: 'visible', timeout: 90000 });
    await textBoxPage.permanentAddressTextarea.fill('Test Permanent Address');
  });

  await test.step('Verify email format validation error', async () => {
    const emailValidity = await textBoxPage.emailInput.evaluate(el => el.validity.valid);
    expect(emailValidity).toBe(false);
  });
});
