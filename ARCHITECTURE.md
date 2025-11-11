# Equipment Rental Form - Technical Architecture Specification

## Project Overview
A simple, static web form for equipment rental that collects user information and equipment selections, then submits the data to a webhook endpoint. The form will be deployed via GitHub Pages.

## Requirements Summary
- **Technology Stack**: HTML5, CSS3, Vanilla JavaScript
- **Target Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Responsiveness**: Basic mobile-friendly design
- **Validation**: Minimal client-side validation
- **Deployment**: GitHub Pages via GitHub Actions

---

## 1. Project File Structure

```
equipment-rental-form/
├── index.html              # Main HTML file with form structure
├── css/
│   └── style.css          # All styling rules
├── js/
│   └── app.js             # Form handling and submission logic
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow for deployment
└── README.md              # Project documentation
```

### File Descriptions

**index.html**
- Contains the complete form structure
- Semantic HTML5 markup
- Meta tags for responsive design
- Links to CSS and JavaScript files

**css/style.css**
- Form layout and styling
- Responsive design rules
- Input field styling
- Table-like equipment list styling
- Feedback message styling

**js/app.js**
- Form submission handler
- Data collection and JSON formatting
- Webhook POST request
- User feedback (success/error messages)
- Basic validation logic

**.github/workflows/deploy.yml**
- GitHub Actions configuration
- Automated deployment to GitHub Pages

---

## 2. JSON Data Format for Submission

The form will submit data in the following JSON structure:

```json
{
  "name": "Jan",
  "surname": "Kowalski",
  "equipment": [
    {
      "item": "Raki",
      "quantity": 2,
      "notes": "Rozmiar 42"
    },
    {
      "item": "Kask",
      "quantity": 1,
      "notes": ""
    },
    {
      "item": "Czekan",
      "quantity": 1,
      "notes": "Dodatkowy uchwyt"
    }
  ],
  "timestamp": "2025-11-11T00:13:00.000Z"
}
```

### Field Specifications

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `name` | string | First name (Imię) | Yes |
| `surname` | string | Last name (Nazwisko) | Yes |
| `equipment` | array | List of equipment items | Yes |
| `equipment[].item` | string | Equipment name | Yes |
| `equipment[].quantity` | integer | Quantity requested | No (defaults to 0) |
| `equipment[].notes` | string | Additional notes | No (defaults to "") |
| `timestamp` | string (ISO 8601) | Form submission time | Yes (auto-generated) |

### Data Validation Rules

1. **Name & Surname**: Required, non-empty strings
2. **Quantity**: Non-negative integers (0-999)
3. **Notes**: Optional string (max 200 characters recommended)
4. **Equipment items**: Always include all three items in submission, even if quantity is 0

---

## 3. HTML Form Structure Outline

### Overall Structure

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <!-- Meta tags for responsive design -->
    <!-- Link to CSS -->
    <!-- Page title -->
</head>
<body>
    <div class="container">
        <header>
            <h1>Formularz wynajmu sprzętu</h1>
        </header>
        
        <main>
            <form id="equipmentForm">
                <!-- Personal Information Section -->
                <section class="personal-info">
                    <div class="form-group">
                        <label for="name">Imię *</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="surname">Nazwisko *</label>
                        <input type="text" id="surname" required>
                    </div>
                </section>
                
                <!-- Equipment Selection Section -->
                <section class="equipment-section">
                    <h2>Wybór sprzętu</h2>
                    <div class="equipment-table">
                        <!-- Table header -->
                        <div class="equipment-row header">
                            <div class="col-equipment">Sprzęt</div>
                            <div class="col-quantity">Ilość</div>
                            <div class="col-notes">Uwagi</div>
                        </div>
                        
                        <!-- Equipment items (3 rows) -->
                        <div class="equipment-row" data-item="Raki">
                            <div class="col-equipment">Raki</div>
                            <div class="col-quantity">
                                <input type="number" name="quantity-raki" min="0" value="0">
                            </div>
                            <div class="col-notes">
                                <input type="text" name="notes-raki">
                            </div>
                        </div>
                        
                        <!-- Similar structure for Kask and Czekan -->
                    </div>
                </section>
                
                <!-- Feedback Message Area -->
                <div id="feedbackMessage" class="feedback hidden"></div>
                
                <!-- Submit Button -->
                <div class="form-actions">
                    <button type="submit" id="submitBtn">Wyślij formularz</button>
                </div>
            </form>
        </main>
        
        <footer>
            <!-- Optional footer content -->
        </footer>
    </div>
    
    <!-- Link to JavaScript -->
</body>
</html>
```

### Key HTML Elements

1. **Form Container**: `<form id="equipmentForm">` with submit event handler
2. **Personal Info Inputs**: Standard text inputs with `required` attribute
3. **Equipment Table**: CSS Grid/Flexbox-based layout (not actual `<table>`)
4. **Equipment Rows**: Each row has data attribute for easy identification
5. **Quantity Inputs**: `<input type="number">` with min="0"
6. **Notes Inputs**: `<input type="text">` for free-form text
7. **Feedback Area**: Hidden div for success/error messages
8. **Submit Button**: Standard button with loading state support

---

## 4. CSS Organization Approach

### CSS Structure (style.css)

```css
/* 1. CSS Variables (Custom Properties) */
:root {
    /* Colors */
    /* Spacing */
    /* Typography */
}

/* 2. Reset & Base Styles */
* {
    box-sizing: border-box;
}

/* 3. Layout */
.container {
    /* Main container styling */
}

/* 4. Typography */
h1, h2, label {
    /* Text styling */
}

/* 5. Form Elements */
.form-group {
    /* Form field groups */
}

input[type="text"],
input[type="number"] {
    /* Input field styling */
}

/* 6. Equipment Table */
.equipment-table {
    /* Grid/Flex layout */
}

.equipment-row {
    /* Row styling */
}

/* 7. Buttons */
button {
    /* Button styling */
}

/* 8. Feedback Messages */
.feedback {
    /* Success/error message styling */
}

/* 9. Responsive Design */
@media (max-width: 768px) {
    /* Mobile adjustments */
}
```

### CSS Design Principles

1. **Mobile-First**: Base styles for mobile, enhance for desktop
2. **CSS Grid/Flexbox**: Use modern layout techniques for equipment table
3. **CSS Variables**: Define colors and spacing in `:root` for consistency
4. **BEM-like Naming**: Use clear, descriptive class names
5. **Accessibility**: Ensure sufficient color contrast and focus states

---

## 5. JavaScript Functionality Structure

### JavaScript Organization (app.js)

```javascript
// 1. Constants
const WEBHOOK_URL = 'https://tantunergon8n.duckdns.org/webhook-test/...';
const EQUIPMENT_ITEMS = ['Raki', 'Kask', 'Czekan'];

// 2. DOM Element References
const form = document.getElementById('equipmentForm');
const submitBtn = document.getElementById('submitBtn');
const feedbackMessage = document.getElementById('feedbackMessage');

// 3. Utility Functions
function collectFormData() {
    // Gather all form data and structure as JSON
}

function validateForm(data) {
    // Basic validation checks
}

function showFeedback(message, type) {
    // Display success/error message
}

function setLoadingState(isLoading) {
    // Toggle loading state on submit button
}

// 4. API Functions
async function submitToWebhook(data) {
    // POST request to webhook
}

// 5. Event Handlers
async function handleFormSubmit(event) {
    event.preventDefault();
    // Main submission logic
}

// 6. Initialization
function init() {
    // Set up event listeners
    form.addEventListener('submit', handleFormSubmit);
}

// 7. Execute on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

### Key JavaScript Functions

**collectFormData()**
- Extract values from all form fields
- Build equipment array by iterating through equipment items
- Add timestamp
- Return structured JSON object

**validateForm(data)**
- Check name and surname are not empty
- Validate quantity values are non-negative integers
- Return validation result with error messages if any

**submitToWebhook(data)**
- Use `fetch()` API to POST JSON data
- Set appropriate headers (`Content-Type: application/json`)
- Handle response (success/error)
- Implement basic error handling

**handleFormSubmit(event)**
- Prevent default form submission
- Collect and validate data
- Show loading state
- Submit to webhook
- Display feedback message
- Optionally reset form on success

---

## 6. GitHub Pages Deployment Strategy

### Deployment Workflow (.github/workflows/deploy.yml)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Deployment Steps

1. **Repository Setup**
   - Create GitHub repository
   - Push all files to `main` branch

2. **GitHub Pages Configuration**
   - Enable GitHub Pages in repository settings
   - Set source to "GitHub Actions"

3. **Workflow Execution**
   - Workflow triggers on push to `main` branch
   - Automatically builds and deploys to GitHub Pages
   - Site available at: `https://<username>.github.io/<repository-name>/`

4. **CORS Considerations**
   - GitHub Pages serves static files over HTTPS
   - Webhook endpoint must accept CORS requests from GitHub Pages domain
   - If CORS issues occur, webhook server needs appropriate headers:
     - `Access-Control-Allow-Origin: *` (or specific domain)
     - `Access-Control-Allow-Methods: POST`
     - `Access-Control-Allow-Headers: Content-Type`

---

## 7. Key Implementation Considerations

### Security
- **Client-side only**: No sensitive data validation (webhook should validate)
- **HTTPS**: GitHub Pages uses HTTPS by default
- **No API keys**: Webhook URL is public in source code
- **Input sanitization**: Webhook server should sanitize all inputs

### User Experience
- **Loading states**: Disable submit button during submission
- **Clear feedback**: Show success/error messages prominently
- **Form reset**: Optionally clear form after successful submission
- **Focus management**: Return focus to first field after reset

### Accessibility
- **Labels**: All inputs have associated `<label>` elements
- **Required fields**: Marked with asterisk (*) and `required` attribute
- **Keyboard navigation**: All form controls are keyboard accessible
- **ARIA attributes**: Add where helpful for screen readers
- **Focus indicators**: Visible focus states on all interactive elements

### Browser Compatibility
- **Fetch API**: Supported in all modern browsers
- **CSS Grid/Flexbox**: Widely supported
- **ES6 JavaScript**: Use modern syntax (const, let, arrow functions, async/await)
- **No polyfills needed**: Target is modern browsers only

### Performance
- **Minimal dependencies**: No external libraries or frameworks
- **Small file size**: Total project < 50KB
- **Fast loading**: All resources inlined or minimal external requests
- **Optimized images**: If any images used, optimize for web

### Error Handling
- **Network errors**: Catch and display user-friendly message
- **Validation errors**: Show inline error messages
- **Timeout handling**: Set reasonable timeout for fetch request
- **Retry logic**: Optional - allow user to retry failed submission

---

## 8. Development Workflow

### Local Development
1. Clone repository
2. Open `index.html` directly in browser (no build step needed)
3. Use browser DevTools for debugging
4. Test with browser's network throttling for slow connections

### Testing Checklist
- [ ] Form validates required fields
- [ ] All equipment items are included in submission
- [ ] JSON format matches specification
- [ ] Webhook receives correct data
- [ ] Success message displays after submission
- [ ] Error message displays on failure
- [ ] Form works on mobile devices
- [ ] Form is keyboard accessible
- [ ] All inputs have proper labels

### Deployment Process
1. Make changes locally
2. Test thoroughly in browser
3. Commit and push to `main` branch
4. GitHub Actions automatically deploys
5. Verify form works on live site
6. Test webhook integration

---

## 9. Future Enhancements (Out of Scope)

Potential improvements for future iterations:
- Form field validation with custom error messages
- Date picker for rental period
- Email confirmation after submission
- Save form data to local storage (auto-save)
- Multi-language support
- Dark mode toggle
- Print-friendly styling
- Advanced accessibility features
- Rate limiting on client side
- Analytics integration

---

## 10. Summary

This architecture provides a clean, maintainable solution for a simple equipment rental form:

- **Simple**: Pure HTML/CSS/JS, no build tools or dependencies
- **Maintainable**: Clear file structure and code organization
- **Responsive**: Works on desktop and mobile devices
- **Accessible**: Follows basic accessibility guidelines
- **Deployable**: GitHub Actions workflow for automated deployment
- **Extensible**: Easy to modify or add features in the future

The implementation should be straightforward, with all files under 200 lines of code each, making it easy to understand, modify, and maintain.