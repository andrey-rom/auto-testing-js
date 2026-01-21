# DemoQA Hybrid API + UI Test Suite

This test suite implements a hybrid approach combining API operations with UI validation for the DemoQA BookStore application.

## Test Workflow

The test follows this complete end-to-end workflow:

1. **CREATE USER (API)**: Creates a new user via `/Account/v1/User` with random credentials
2. **AUTHENTICATE (API)**: Generates authentication token via `/Account/v1/GenerateToken`
3. **ADD BOOKS (API)**: 
   - Fetches available books via `GET /BookStore/v1/Books`
   - Adds 2 books to user's collection via `POST /BookStore/v1/Books`
4. **UI VALIDATION**: 
   - Logs in to `https://demoqa.com/login` using API-created credentials
   - Navigates to `/profile`
   - Asserts the 2 books added via API are visible in the UI table
5. **DELETE BOOK (API)**: Deletes one book via `DELETE /BookStore/v1/Book`
6. **FINAL UI VERIFY**: Refreshes the Profile page and asserts the deleted book is gone

## Running the Tests

### Run the Hybrid API + UI Test

```bash
npm test -- tests/hybrid/api-ui-workflow.spec.js
```

Or using Playwright directly:

```bash
npx playwright test tests/hybrid/api-ui-workflow.spec.js
```

### Run with specific browser

```bash
npx playwright test tests/hybrid/api-ui-workflow.spec.js --project=chromium
```

### Run in headed mode (see browser)

```bash
npx playwright test tests/hybrid/api-ui-workflow.spec.js --headed
```

## Test Structure

- **API Client**: `src/api/DemoQAClient.js` - Handles all API operations
- **Page Objects**: 
  - `src/pageObjects/LoginPage.js` - Login page interactions
  - `src/pageObjects/ProfilePage.js` - Profile page interactions
- **Utilities**: 
  - `src/helper/randomCredentials.js` - Generates random usernames and passwords
- **Test File**: `tests/hybrid/api-ui-workflow.spec.js` - Main end-to-end test

## Key Features

- ✅ Random credential generation (username format: `User_<timestamp>_<random>`)
- ✅ Proper API authentication with token management
- ✅ Page Object Model (POM) for UI interactions
- ✅ Fluent assertions using Playwright's expect API
- ✅ Clean setup/teardown with proper error handling
- ✅ Data storage for sharing data between API and UI steps

## Requirements

- Node.js (v16 or higher)
- npm or yarn
- Playwright browsers installed (`npx playwright install`)

## Notes

- All credentials are randomly generated - no hardcoded secrets
- The test includes both API verification and UI validation for comprehensive coverage
- If UI verification encounters issues, API verification ensures the test still validates the core functionality

## Configuration via env file (no hardcoded values)

This project reads configuration from `env` (see `env.example`):

- `DEMOQA_BASE_URL`
- `PW_TEST_TIMEOUT_MS`
- `PW_NAVIGATION_TIMEOUT_MS`
- `PW_ASSERTION_TIMEOUT_MS`
- `PW_SELECTOR_TIMEOUT_MS`

To change values:

1. Copy `env.example` to `env`
2. Edit values in `env`
