# 🎭 Playwright Test Automation Portfolio

A complete test automation portfolio showcasing Playwright skills from beginner to expert level (1–10). Built with JavaScript, targeting real-world test scenarios on [The Internet](https://the-internet.herokuapp.com) — a sandbox for test automation practice.

---

## 🗂 Project Structure

```
playwright-portfolio/
├── playwright.config.js         # Global Playwright configuration
├── package.json
├── pages/                       # Page Object Models
│   └── LoginPage.js
├── fixtures/                    # Custom fixtures (extended test objects)
├── utils/                       # Helper utilities
├── test-data/                   # JSON/CSV test data files
└── tests/
    ├── level1/  🟢 Basic Navigation & Assertions
    ├── level2/  🟡 Form Interactions
    ├── level3/  🟡 Waiting Strategies & Dynamic Content
    ├── level4/  🟠 Page Object Model (POM)
    ├── level5/  🟠 Fixtures & Test Hooks
    ├── level6/  🔴 API Testing & Network Interception
    ├── level7/  🔴 Advanced Interactions (drag, upload, iframes, dialogs)
    ├── level8/  🔴 Visual Testing & Accessibility  --> in progress
    ├── level9/  🔴 Data-Driven Tests & Parallel Execution  --> in progress
    └── level10/ ⚫ Full E2E Framework (auth reuse, performance, security) --> in progress
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
git clone https://github.com/jtodoric/playwright-portfolio.git
cd playwright-portfolio
npm install
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run with headed browser (see the browser)
npm run test:headed

# Open interactive UI mode
npm run test:ui

# Run specific level
npm run test:level1
npm run test:level5
npm run test:level10

# Run by browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with HTML report
npm test && npm run test:report
```

---

## 📚 Level Breakdown

### 🟢 Level 1 — Basic Navigation & Assertions
**File:** `tests/level1/basic-navigation.spec.js`

| Concept | Description |
|---|---|
| `page.goto()` | Navigate to URLs |
| `expect(page).toHaveTitle()` | Assert page title |
| `expect(locator).toBeVisible()` | Check element visibility |
| `expect(page).toHaveURL()` | Verify URL |
| `page.click()` | Click elements |

---

### 🟡 Level 2 — Form Interactions
**File:** `tests/level2/form-interactions.spec.js`

| Concept | Description |
|---|---|
| `page.fill()` | Fill text inputs |
| `locator.check()` / `uncheck()` | Manage checkboxes |
| `locator.selectOption()` | Select dropdown values |
| `locator.clear()` | Clear inputs |
| Login/logout flow | Full form submission |

---

### 🟡 Level 3 — Waiting Strategies & Dynamic Content
**File:** `tests/level3/waiting-strategies.spec.js`

| Concept | Description |
|---|---|
| Auto-wait | Playwright's built-in waiting |
| `waitForResponse()` | Wait for network calls |
| `toBeVisible({ timeout })` | Custom timeouts |
| Dynamic loading | Handle elements that appear after interaction |
| `networkidle` | Wait for network quiet |

---

### 🟠 Level 4 — Page Object Model (POM)
**File:** `tests/level4/page-object-model.spec.js`  
**Pages:** `pages/LoginPage.js`

| Concept | Description |
|---|---|
| POM pattern | Encapsulate page selectors & actions |
| Class-based pages | `LoginPage`, `CheckboxPage`, `DropdownPage` |
| Reusable methods | `.login()`, `.logout()`, `.selectByLabel()` |
| Separation of concerns | Tests vs page logic |

---

### 🟠 Level 5 — Fixtures & Test Hooks
**File:** `tests/level5/fixtures-and-hooks.spec.js`

| Concept | Description |
|---|---|
| `test.beforeEach()` | Setup before each test |
| `test.afterEach()` | Teardown after each test |
| `test.beforeAll()` | One-time suite setup |
| `test.afterAll()` | One-time suite teardown |
| `test.extend()` | Custom fixtures (e.g., `authenticatedPage`) |

---

### 🔴 Level 6 — API Testing & Network Interception
**File:** `tests/level6/api-and-network.spec.js`

| Concept | Description |
|---|---|
| `page.on('request')` | Listen to network requests |
| `page.on('response')` | Intercept responses |
| `page.route()` | Mock/modify network calls |
| `request` fixture | Direct API calls without browser |
| Header assertions | Verify response headers |
| Route abort | Block specific resources |

---

### 🔴 Level 7 — Advanced Interactions
**File:** `tests/level7/advanced-interactions.spec.js`

| Concept | Description |
|---|---|
| `locator.hover()` | Mouse hover |
| `page.keyboard` | Keyboard shortcuts |
| `locator.dragTo()` | Drag and drop |
| `fileInput.setInputFiles()` | File uploads |
| `page.frameLocator()` | Work inside iframes |
| `context.waitForEvent('page')` | Multiple tabs/windows |
| `dialog` events | Alerts, confirms, prompts |

---

### 🔴 Level 8 — Visual Testing & Accessibility  --> in progress
**File:** `tests/level8/visual-and-accessibility.spec.js`

| Concept | Description |
|---|---|
| `page.screenshot()` | Full page & element screenshots |
| `toHaveScreenshot()` | Visual regression snapshots |
| `maxDiffPixelRatio` | Tolerance for visual diffs |
| `setViewportSize()` | Mobile/tablet/desktop testing |
| A11y attributes | Verify ARIA, labels, roles |
| Tab order | Keyboard navigation testing |

---

### 🔴 Level 9 — Data-Driven & Parallel Tests  --> in progress
**File:** `tests/level9/data-driven-parallel.spec.js`

| Concept | Description |
|---|---|
| `for...of` loops | Parametrized test cases |
| Test data arrays | External data driving tests |
| `test.skip()` | Conditional test skipping |
| `expect.soft()` | Non-fatal assertions |
| Test annotations | `@smoke`, `@regression` tags |
| Parallel workers | Configured in `playwright.config.js` |

---

### ⚫ Level 10 — Full E2E Framework  --> in progress
**File:** `tests/level10/full-e2e-framework.spec.js`

| Concept | Description |
|---|---|
| Auth state reuse | `storageState` across tests |
| Web Vitals | `performance.timing` metrics |
| Console error monitoring | Listen for JS errors |
| Multi-step journeys | Complete user workflows |
| `testInfo.attach()` | Attach screenshots to reports |
| Custom JSON reporting | Write test results programmatically |
| XSS/edge case handling | Security test scenarios |
| Concurrent users | Parallel browser contexts |
| Slow network simulation | `context.route()` with delays |

---

## 🛠 Configuration

### `playwright.config.js`
- **Base URL:** `https://the-internet.herokuapp.com`
- **Projects:** Chromium, Firefox, WebKit, Mobile Chrome
- **Retries:** 2 on CI, 0 locally
- **Reporter:** HTML + List
- **Artifacts:** Screenshots & videos on failure, traces on first retry

### Environment Variables
Create a `.env` file for sensitive config:
```env
BASE_URL=https://the-internet.herokuapp.com
TEST_USERNAME=tomsmith
TEST_PASSWORD=SuperSecretPassword!
```

---

## 📊 Test Reports

After running tests:
```bash
npx playwright show-report
```
Opens an interactive HTML report with:
- Test results per browser
- Screenshots on failure
- Video recordings on failure
- Trace viewer for debugging

---

## 🤝 Contributing

Feel free to fork this repo and extend it with:
- Additional test scenarios
- More complex POM hierarchies
- CI/CD pipeline examples (GitHub Actions)
- Performance benchmarking

---

## 📜 License

MIT — free to use for your own portfolio!

---

*Built with ❤️ using [Playwright](https://playwright.dev) & JavaScript*
