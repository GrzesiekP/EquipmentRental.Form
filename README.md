# Equipment Rental Form

A modern, responsive Angular web application for managing equipment rental requests. This application provides an intuitive interface for users to submit rental requests with automatic date validation and formatted output.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client Information**: Capture essential customer details (name, surname, PESEL/ID, email, phone, address)
- **Equipment Selection**: Choose from 16 different equipment types with quantity selection and notes
- **Date Validation**: Prevents invalid rental periods (return date must be after pickup date, no past dates)
- **Time Spinners**: Easy time selection with +/- buttons in 15-minute increments
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **Modern UI**: Clean interface with smooth animations and user-friendly design
- **Success Page**: Confirmation page after successful submission

## Technologies Used

- **Angular 20.3**: Latest version of Angular framework with standalone components
- **TypeScript**: Strongly typed programming language
- **Reactive Forms**: Angular's reactive forms for form handling and validation
- **HttpClient**: For API communication
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **GitHub Pages**: Automated deployment via GitHub Actions

## Project Structure

```
EquipmentRental.Form/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for deployment
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
│   │   ├── app.config.ts       # Application configuration
│   │   └── app.routes.ts       # Route configuration
│   ├── index.html              # Main HTML file
│   ├── main.ts                 # Application bootstrap
│   └── styles.css              # Global styles
├── angular.json                # Angular CLI configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── ARCHITECTURE.md             # Technical architecture documentation
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

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

### Deployment to GitHub Pages

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` or `master` branch.

#### Initial Setup

1. **Create a GitHub repository** for this project

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment", select:
     - Source: **GitHub Actions**

3. **Push your code**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```

4. **Automatic deployment**:
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically trigger
   - Check the "Actions" tab in your repository to monitor deployment progress
   - Once complete, your site will be live at: `https://GrzesiekP.github.io/EquipmentRental.Form/`

#### Workflow Details

The deployment workflow:
- Triggers on every push to the `main` or `master` branch
- Installs Node.js and project dependencies
- Builds the Angular application for production
- Uploads the build artifacts
- Deploys to GitHub Pages
- Uses official GitHub Actions for reliability

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
   - Use the +/- buttons to adjust time in 15-minute increments
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
