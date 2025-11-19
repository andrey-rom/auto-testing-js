import { test } from './fixtures/fillFormFixtures.js';

test('Fill text Box scenario', async ({ textBoxPage, storedUser }) => {
  const { user } = storedUser;
  console.log(storedUser);
  await test.step('Fill text box', async () => {
    await textBoxPage.fillTextBoxFields(user);
  });

  await test.step('submit form', async () => {
    await textBoxPage.clickSubmitButton();
  });

  await test.step('expected values', async () => {
    await textBoxPage.expectedOutputFieldsValues(user);
  });
});
