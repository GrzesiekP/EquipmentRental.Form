# Equipment Rental Form - Technical Architecture Specification (Vue.js)

## Project Overview
A responsive web form for equipment rental built with Vue.js 3, collecting user information and equipment selections, then submitting the data to a webhook endpoint. The form is deployed via GitHub Pages.

## Requirements Summary
- **Technology Stack**: HTML5, CSS3, Vue.js 3 (CDN)
- **Target Browsers**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Responsiveness**: Mobile-friendly design
- **Validation**: Client-side validation with Vue.js
- **Deployment**: GitHub Pages via GitHub Actions

---

## 1. Project File Structure

```
equipment-rental-form/
├── index.html              # Main HTML file with Vue.js template syntax
├── css/
│   └── style.css          # All styling rules
├── js/
│   ├── settings.js        # Configuration (equipment items, webhook URL)
│   └── vue-app.js         # Vue.js 3 application logic
├── assets/
│   └── logo.png           # Application logo
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow for deployment
└── README.md              # Project documentation
```

### File Descriptions

**index.html**
- Contains the complete form structure with Vue.js template syntax
- Vue directives (v-model, v-for, @click, etc.)
- Semantic HTML5 markup
- Meta tags for responsive design
- Links to Vue.js CDN, CSS and JavaScript files

**css/style.css**
- Form layout and styling
- Responsive design rules
- Input field styling
- Equipment table styling
- Feedback message styling
- Unchanged from original design

**js/settings.js**
- Configuration object (SETTINGS)
- Webhook URL
- Equipment items list

**js/vue-app.js**
- Vue.js 3 application instance
- Reactive data management
- Form submission handler
- Data collection and JSON formatting
- Webhook POST request
- User feedback (success/error messages)
- Form validation logic

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

## 5. Vue.js Application Structure

### Vue.js Organization (vue-app.js)

```javascript
// Check if Vue is loaded
if (typeof Vue === 'undefined') {
    // Handle error case
} else {
    const { createApp } = Vue;
    
    createApp({
        data() {
            return {
                // Configuration
                webhookUrl: SETTINGS.webhookUrl,
                equipmentItems: SETTINGS.equipmentItems,
                
                // Form data (reactive)
                formData: { /* ... */ },
                
                // UI state
                isLoading: false,
                showSuccessPage: false,
                feedback: { message: '', type: '' }
            };
        },
        
        mounted() {
            // Initialize equipment data
            // Set default dates
        },
        
        methods: {
            // Data formatting methods
            equipmentNameToId() {},
            formatDateInput() {},
            formatSubmitDate() {},
            formatTime() {},
            
            // Time manipulation methods
            incrementTime() {},
            decrementTime() {},
            
            // Quantity controls
            incrementQuantity() {},
            decrementQuantity() {},
            
            // Validation
            validateForm() {},
            
            // Data collection
            collectFormData() {},
            
            // API interaction
            submitToWebhook() {},
            
            // UI feedback
            showFeedback() {},
            hideFeedback() {},
            
            // Form submission
            handleFormSubmit() {}
        }
    }).mount('#app');
}
```

### Key Vue.js Features Used

**Reactive Data Binding (v-model)**
- Two-way data binding for all form inputs
- Automatic UI updates when data changes

**Event Handling (@click, @submit)**
- Form submission with @submit.prevent
- Button clicks for spinners and quantity controls

**Conditional Rendering (:class)**
- Dynamic CSS classes based on state
- Show/hide feedback messages and success page

**List Rendering (v-for)**
- Dynamic equipment rows generation
- Iterates over equipmentItems array

**Lifecycle Hooks (mounted)**
- Initialize equipment data structure
- Set default dates on component mount

**Methods**
- All business logic organized as Vue methods
- Easy to test and maintain

### Vue.js vs Vanilla JavaScript Benefits

1. **Reactive Data**: Automatic UI updates without manual DOM manipulation
2. **Template Syntax**: Cleaner, more readable HTML with directives
3. **Component-Based**: Scalable architecture for future enhancements
4. **State Management**: Centralized data management
5. **Declarative**: What to render, not how to render it

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
- **Vue.js 3**: Requires modern browsers with ES6 support
- **Fetch API**: Supported in all modern browsers
- **CSS Grid/Flexbox**: Widely supported
- **No polyfills needed**: Target is modern browsers only
- **CDN Dependency**: Requires internet connection for Vue.js CDN

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
2. Open `index.html` in browser (requires internet connection for Vue.js CDN)
3. Use browser DevTools for debugging
4. Vue.js DevTools extension recommended for development
5. Test with browser's network throttling for slow connections

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

This architecture provides a clean, maintainable solution for an equipment rental form using Vue.js 3:

- **Modern Framework**: Vue.js 3 for reactive, component-based architecture
- **Simple**: CDN-based Vue.js, no build tools required
- **Maintainable**: Clear separation of concerns and organized code structure
- **Responsive**: Works on desktop and mobile devices
- **Accessible**: Follows basic accessibility guidelines
- **Deployable**: GitHub Actions workflow for automated deployment
- **Extensible**: Easy to modify or add features with Vue.js components

The Vue.js implementation provides better code organization, reactive data binding, and a more maintainable codebase compared to vanilla JavaScript, while maintaining the same visual appearance and functionality.