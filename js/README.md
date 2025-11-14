# JavaScript Files

## Current Files

### vue-app.js (Active)
This is the current Vue.js 3 application file. This is the file that powers the equipment rental form.

**Status**: ✅ Active and in use

### app.js (Legacy)
This is the original vanilla JavaScript application file kept for reference and backup purposes.

**Status**: ⚠️ Legacy - Not loaded by index.html

### settings.js (Active)
Configuration file containing:
- Webhook URL for form submission
- List of equipment items

**Status**: ✅ Active and in use by both app.js and vue-app.js

## Migration

The application was migrated from vanilla JavaScript (app.js) to Vue.js 3 (vue-app.js) on November 14, 2025.

See MIGRATION.md in the root directory for details about the migration process.

## Which File is Used?

The `index.html` file loads:
```html
<script src="js/settings.js"></script>
<script src="js/vue-app.js"></script>
```

The `app.js` file is NOT loaded but kept for reference.
