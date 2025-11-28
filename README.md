# Equipment Rental Form

A modern, responsive Angular web application for managing equipment rental requests. This application provides an intuitive interface for users to submit rental requests with automatic date validation and formatted output.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client Information**: Capture essential customer details (name, surname, PESEL/ID, email, phone, address)
- **Equipment Selection**: Choose from 16 different equipment types with quantity selection and notes
- **Date Validation**: Prevents invalid rental periods (return date must be after pickup date, no past dates)
- **Time Spinners**: Easy time selection with +/- buttons in 30-minute increments
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **Modern UI**: Clean interface with smooth animations and user-friendly design
- **Success Page**: Confirmation page after successful submission

## Technologies Used

- **Angular 20.3**: Latest version of Angular framework with standalone components
- **TypeScript**: Strongly typed programming language
- **Angular Material**: Material Design components for UI (form fields, buttons, date/time pickers, tables, icons, cards)
- **Reactive Forms**: Angular's reactive forms for form handling and validation
- **HttpClient**: For API communication
- **SCSS/CSS3**: Modern styling with SCSS for theming and CSS for custom styles
- **Material Icons**: Icon library for Material Design icons

## Project Structure

```
EquipmentRental.Form/
├── public/
│   ├── favicon.ico             # Site favicon
│   └── logo.png                # Application logo
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── equipment-rental-form/  # Main form component
│   │   ├── models/
│   │   │   └── equipment-rental.model.ts  # TypeScript interfaces
│   │   ├── services/
│   │   │   ├── settings.service.ts        # Configuration service
│   │   │   └── form-submission.service.ts # Form submission service
│   │   ├── app.ts              # Root component
│   │   ├── app.html            # Root component template
│   │   ├── app.css             # Root component styles
│   │   ├── app.spec.ts         # Root component tests
│   │   ├── app.config.ts       # Application configuration
│   │   └── app.routes.ts       # Route configuration
│   ├── index.html              # Main HTML file
│   ├── main.ts                 # Application bootstrap
│   ├── material-theme.scss     # Angular Material theme configuration
│   └── styles.css              # Global styles
├── angular.json                # Angular CLI configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # TypeScript app configuration
├── tsconfig.spec.json          # TypeScript test configuration
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

> **Important**: If you have the old deprecated `angular-cli` package installed globally, you may encounter build errors. This project uses the modern `@angular/cli` which is included in the project dependencies. Always use `npm run build` instead of running `ng build` directly.

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/GrzesiekP/EquipmentRental.Form.git
   cd EquipmentRental.Form
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

4. **Build for production**
   ```bash
   npm run build
   ```
   The build artifacts will be stored in the `dist/equipment-rental-angular/browser/` directory.

### Troubleshooting

**Error: "ReferenceError: primordials is not defined"**

This error occurs when using an old global installation of `angular-cli` with Node.js 12+. To fix:

1. **Use npm scripts** (recommended):
   ```bash
   npm run build   # Instead of: ng build
   npm start       # Instead of: ng serve
   ```

2. **Or uninstall the old CLI and use the local version**:
   ```bash
   npm uninstall -g angular-cli
   npm uninstall -g @angular/cli
   npx @angular/cli build  # Use npx to run the local CLI
   ```

3. **Or update to the modern CLI globally**:
   ```bash
   npm uninstall -g angular-cli
   npm install -g @angular/cli@latest
   ```

The project is configured with Angular 20 and all dependencies are included locally. Always use `npm run` commands to ensure you're using the correct versions.

### Deployment

To deploy this application, you can use various hosting platforms:

#### GitHub Pages (Manual)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist/equipment-rental-angular/browser/` directory** to your hosting platform

3. **For GitHub Pages**:
   - Create a GitHub repository
   - Enable GitHub Pages in repository settings
   - Push the built files to the `gh-pages` branch or use GitHub Actions
   - Your site will be available at: `https://[username].github.io/[repository-name]/`

#### Other Hosting Options

- **Netlify**: Drag and drop the `dist/equipment-rental-angular/browser/` folder
- **Vercel**: Connect your repository and configure the build output directory
- **Azure Static Web Apps**: Deploy via Azure Portal or GitHub Actions
- **AWS S3 + CloudFront**: Upload to S3 bucket and configure CloudFront distribution

## How to Use the Form

1. **Client Information**:
   - Enter your name and surname
   - Provide PESEL or ID number
   - Enter your phone number
   - Provide a valid email address
   - Enter your address

2. **Rental Period**:
   - **Pickup Date & Time**: Select when you want to pick up the equipment
   - **Return Date & Time**: Select when you plan to return it
   - Use the +/- buttons to adjust time in 30-minute increments
   - The form automatically validates that dates are valid

3. **Equipment Selection**:
   - Choose from 16 available equipment types:
     - Raki Koszykowe
     - Czekan
     - Raki Półautomatyczne
     - Kijki Trekkingowe
     - ABC Lawinowe
     - Łopata Lawinowa
     - Detektor Lawinowy
     - Sonda Lawinowa
     - Zestaw Via Ferrata
     - Kask
     - Lonża Via Ferrata
     - Uprząż
     - Stuptuty
     - Nosidełko Turystyczne dla Dzieci
     - Raczki Turystyczne
     - Plecak
   - Use the +/- buttons to adjust quantity
   - Add notes for specific requirements (e.g., boot size for crampons)

4. **Submit**:
   - Review your information
   - Click "Wyślij" (Submit)
   - View the success confirmation page

## Form Validation

The application includes comprehensive validation:
- All fields are required
- Email must be in valid format
- Pickup date cannot be in the past
- Return date must be after pickup date
- Helpful error messages guide you to correct any issues

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or feedback, please open an issue in the GitHub repository.

---

**Built with ❤️ using Angular 20**
