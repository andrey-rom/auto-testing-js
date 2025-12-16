# Automated Testing Project

This project contains automated tests for [demoqa.com](https://demoqa.com) using Playwright framework with Page Object Model pattern.

## Prerequisites

- Node.js (LTS version)
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ryasrdp/2025-LR-S7-AutoTesting-JS.git
cd 2025-LR-S7-AutoTesting-JS
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Test Scenarios

The project includes 5 test scenarios:

1. **Alerts** (`tests/alertPage.spec.js`) - Tests all alert types (alert, confirm, prompt)
2. **Practice Form** (`tests/practiceForm.spec.js`) - Fills all form fields and validates results
3. **Text Box** (`tests/textBox.spec.js`) - Fills text box with random data and validates output
4. **Tool Tips** (`tests/toolTips.spec.js`) - Checks text on all tooltips
5. **Select Menu** (`tests/selectMenu.spec.js`) - Tests all dropdown functionalities

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (with browser UI)
```bash
npm run test-headed
```

### Run tests with UI mode
```bash
npm run tets-ui
```

### Run tests with specific viewport size
```bash
VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npm test
VIEWPORT_WIDTH=1366 VIEWPORT_HEIGHT=768 npm test
```

### Run tests with specific number of workers (parallel execution)
```bash
workers=2 npm test
workers=4 npm test
```

### Run specific test by keyword
```bash
runThis="Alert" npm test
runThis="Practice Form" npm test
runThis="Text Box" npm test
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Run tests with specific viewport and browser
```bash
VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npx playwright test --project=chromium
```

## Project Structure

```
.
├── src/
│   ├── pageObjects/          # Page Object Model classes
│   │   ├── BasePage.js       # Base page class
│   │   ├── MainPage.js       # Main page
│   │   ├── AlertsPage.js     # Alerts page
│   │   ├── TextBoxPage.js    # Text Box page
│   │   ├── PracticeFormPage.js # Practice Form page
│   │   ├── ToolTipsPage.js   # Tool Tips page
│   │   └── SelectMenuPage.js # Select Menu page
│   ├── helper/               # Helper classes
│   │   ├── userCreator.js    # User data generator
│   │   └── DataStorage.js    # Data storage utilities
│   └── utils/                # Utility classes
│       ├── AdBlock.js        # Ad blocking utilities
│       └── Randomizer.js     # Random value generator
├── tests/                    # Test files
│   ├── alertPage.spec.js
│   ├── practiceForm.spec.js
│   ├── textBox.spec.js
│   ├── toolTips.spec.js
│   ├── selectMenu.spec.js
│   └── fixtures/            # Test fixtures
├── playwright.config.js      # Playwright configuration
└── package.json             # Project dependencies
```

## Features

- ✅ Page Object Model pattern
- ✅ Cross-browser testing (Chrome and Firefox)
- ✅ Multiple viewport sizes (1920x1080 and 1366x768)
- ✅ Parallel test execution
- ✅ Automatic screenshot on failure
- ✅ Test filtering by keyword
- ✅ Automated data generation using Fakerator
- ✅ Negative test scenarios
- ✅ Mandatory field validation
- ✅ CI/CD integration with GitHub Actions

## CI/CD

Tests run automatically:
- On every push and pull request
- Daily at 2 AM UTC (scheduled)

Test reports and screenshots are saved as GitHub Actions artifacts.

## Test Reports

After running tests, HTML reports are generated in the `playwright-report` directory. To view:

```bash
npx playwright show-report
```

## Environment Variables

- `VIEWPORT_WIDTH` - Set viewport width (default: 1920)
- `VIEWPORT_HEIGHT` - Set viewport height (default: 1080)
- `workers` - Set number of parallel workers
- `runThis` - Filter tests by keyword
- `CI` - Set to true in CI environment

## Browser Support

- Google Chrome (Chromium)
- Mozilla Firefox

## Viewport Sizes

- 1920x1080 (Full HD)
- 1366x768 (HD)

## License

ISC




