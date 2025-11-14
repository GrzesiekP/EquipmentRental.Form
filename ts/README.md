# TypeScript Source Files

This directory contains the TypeScript source files for the Equipment Rental Form application.

## Files

- **settings.ts** - Application configuration (webhook URL, equipment items)
- **vue-app.ts** - Main Vue.js application with type definitions

## Building

To compile TypeScript to JavaScript, run:

```bash
npm run build
```

This will compile the TypeScript files from the `ts/` directory and output JavaScript files to the `js/` directory.

## Development

For continuous compilation during development, use:

```bash
npm run watch
```

This will watch for changes to TypeScript files and automatically recompile them.

## Type Safety

All TypeScript files include proper type definitions for:
- Form data structures
- Equipment items
- Validation results
- API responses
- Vue.js component data and methods

This provides better code quality, IDE support, and helps catch errors at compile time.
