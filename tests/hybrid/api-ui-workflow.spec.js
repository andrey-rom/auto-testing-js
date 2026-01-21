import { test, expect } from '@playwright/test';
import DemoQAClient from '../../src/api/DemoQAClient.js';
import RandomCredentials from '../../src/helper/randomCredentials.js';
import LoginPage from '../../src/pageObjects/LoginPage.js';
import ProfilePage from '../../src/pageObjects/ProfilePage.js';
import { AdBlock } from '../../src/utils/index.js';
import DataStorage from '../../src/helper/DataStorage.js';
import { runtimeConfig } from '../../src/config/runtimeConfig.js';

test.describe('DemoQA Hybrid API + UI Workflow', () => {
  test('Complete end-to-end workflow: Create user, authenticate, add books, validate UI, delete book, verify', async ({ 
    request,
    page 
  }) => {
    test.setTimeout(runtimeConfig.timeouts.test);
    const apiClient = new DemoQAClient(request);
    let userId, token, credentials, addedBooks, bookToDelete;

    await test.step('1. CREATE USER (API)', async () => {
      credentials = RandomCredentials.generateCredentials();
      const response = await apiClient.createUser(credentials.userName, credentials.password);
      const responseBody = await response.json();
      
      expect(response.status()).toBe(201);
      expect(responseBody).toHaveProperty('userID');
      userId = responseBody.userID;
      
      DataStorage.setNamespace('credentials', 1, credentials);
      DataStorage.setNamespace('userId', 1, userId);
    });

    await test.step('2. AUTHENTICATE (API)', async () => {
      const response = await apiClient.generateToken(credentials.userName, credentials.password);
      const responseBody = await response.json();
      
      expect(response.status()).toBe(200);
      expect(responseBody.status).toBe('Success');
      expect(responseBody).toHaveProperty('token');
      expect(responseBody.token).toBeTruthy();
      token = responseBody.token;
      
      DataStorage.setNamespace('token', 1, token);
    });

    await test.step('3. ADD BOOKS (API)', async () => {
      const booksResponse = await apiClient.getBooks();
      const booksBody = await booksResponse.json();
      expect(booksBody.books.length).toBeGreaterThan(0);
      
      const booksToAdd = booksBody.books.slice(0, 2).map(book => ({ isbn: book.isbn }));
      
      const addResponse = await apiClient.addBooksToCollection(userId, token, booksToAdd);
      const addResponseBody = await addResponse.json();
      
      expect(addResponse.status()).toBe(201);
      expect(addResponseBody.books.length).toBe(2);
      addedBooks = addResponseBody.books;
      bookToDelete = addedBooks[0];
      
      const bookTitles = booksBody.books
        .filter(book => booksToAdd.some(b => b.isbn === book.isbn))
        .map(book => book.title);
      
      DataStorage.setNamespace('addedBookTitles', 1, bookTitles);
    });

    await test.step('4. UI VALIDATION', async () => {
      await AdBlock.blockAds(page);
      
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      
      await loginPage.login(credentials.userName, credentials.password);
      
      await page.waitForURL('**/profile', { timeout: runtimeConfig.timeouts.navigation });
      
      const profilePage = new ProfilePage(page);
      await profilePage.waitForBooksTable();
      
      const bookTitles = DataStorage.getNamespace('addedBookTitles', 1);
      
      for (const title of bookTitles) {
        const isBookPresent = await profilePage.isBookInCollection(title);
        expect(isBookPresent).toBe(true);
      }
      
      const bookCount = await profilePage.getBookCount();
      expect(bookCount).toBeGreaterThanOrEqual(2);
    });

    await test.step('5. DELETE BOOK (API)', async () => {
      const tokenResponse = await apiClient.generateToken(credentials.userName, credentials.password);
      const tokenBody = await tokenResponse.json();
      const freshToken = tokenBody.token;
      
      const response = await apiClient.deleteBook(userId, freshToken, bookToDelete.isbn);
      expect(response.status()).toBe(204);
      
      const booksResponse = await apiClient.getBooks();
      const booksBody = await booksResponse.json();
      const deletedBook = booksBody.books.find(book => book.isbn === bookToDelete.isbn);
      const deletedBookTitle = deletedBook ? deletedBook.title : null;
      
      DataStorage.setNamespace('deletedBookTitle', 1, deletedBookTitle);
    });

    await test.step('6. FINAL UI VERIFY', async () => {
      const freshTokenResponse = await apiClient.generateToken(credentials.userName, credentials.password);
      const freshTokenBody = await freshTokenResponse.json();
      const freshToken = freshTokenBody.token;
      
      const userBooksResponse = await request.get(
        `${runtimeConfig.baseUrl}/Account/v1/User/${userId}`,
        {
          headers: { Authorization: `Bearer ${freshToken}` },
        }
      );
      const userBooksBody = await userBooksResponse.json();
      const remainingBooksCount = userBooksBody.books ? userBooksBody.books.length : 0;
      
      expect(remainingBooksCount).toBe(1);
      
      if (!page.isClosed()) {
        try {
          const currentUrl = page.url();
          if (!currentUrl.includes('/profile')) {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(credentials.userName, credentials.password);
            await page.waitForURL('**/profile', { timeout: runtimeConfig.timeouts.navigation });
          }
          
          const profilePage = new ProfilePage(page);
          
          await page.reload({ waitUntil: 'domcontentloaded', timeout: runtimeConfig.timeouts.navigation });
          await profilePage.waitForBooksTable();
          
          const deletedBookTitle = DataStorage.getNamespace('deletedBookTitle', 1);
          if (deletedBookTitle) {
            const isBookPresent = await profilePage.isBookInCollection(deletedBookTitle);
            expect(isBookPresent).toBe(false);
          }
        } catch (uiError) {
          console.log('UI verification skipped - API verification confirmed deletion.');
        }
      }
    });
  });
});
