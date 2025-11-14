# Equipment Rental Form

A modern, responsive React application for managing equipment rental requests. This application provides an intuitive interface for users to submit rental requests with automatic date validation and webhook submission.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client Information**: Capture essential customer details (name, PESEL/ID, phone, email, address)
- **Equipment Selection**: Choose from various mountain equipment types with quantity selection
- **Date & Time Selection**: Pick rental pickup and return dates with time selection
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **Modern UI**: Clean interface with smooth animations and user-friendly design built with React
- **Webhook Integration**: Submits form data to configured webhook endpoint
- **Success Page**: Displays confirmation after successful form submission

## Demo

Visit the live application: [https://&lt;your-username&gt;.github.io/&lt;repository-name&gt;/](https://github.com/&lt;your-username&gt;/&lt;repository-name&gt;)

## Technologies Used

- **React 18**: Modern JavaScript library for building user interfaces
- **Vite**: Next-generation frontend build tool for fast development
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **GitHub Pages**: Automated deployment via GitHub Actions

## Project Structure

```
EquipmentRental.Form/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for deployment
├── public/
│   └── logo.png                # Application logo
├── src/
│   ├── components/             # React components
│   │   ├── PersonalInfoSection.jsx
│   │   ├── RentalDatesSection.jsx
│   │   ├── EquipmentSection.jsx
│   │   └── SuccessPage.jsx
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   ├── index.css               # Global styles
│   ├── settings.js             # Configuration settings
│   ├── utils.js                # Utility functions
│   └── validation.js           # Form validation logic
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
├── ARCHITECTURE.md             # Technical architecture documentation
└── README.md                   # This file
```

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<repository-name>.git
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   - The application will be available at `http://localhost:5173`
   - Hot module replacement (HMR) is enabled for fast development

4. **Build for production**
   ```bash
   npm run build
   ```
   - Creates an optimized production build in the `dist` folder

### Deployment to GitHub Pages

The application is automatically deployed to GitHub Pages when changes are pushed to the `master` branch.

#### Initial Setup

1. **Create a GitHub repository** for this project

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment", select:
     - Source: **GitHub Actions**

3. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M master
   git remote add origin https://github.com/<your-username>/<repository-name>.git
   git push -u origin master
   ```

4. **Automatic deployment**:
   - The GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml:1)) will automatically trigger
   - The workflow installs dependencies, builds the React app, and deploys to GitHub Pages
   - Check the "Actions" tab in your repository to monitor deployment progress
   - Once complete, your site will be live at: `https://<your-username>.github.io/<repository-name>/`

#### Workflow Details

The deployment workflow:
- Triggers on every push to the `master` branch
- Installs Node.js and project dependencies
- Builds the React application using Vite
- Uploads the build artifact to GitHub Pages
- Deploys to GitHub Pages
- Uses official GitHub Actions for reliability
- Prevents concurrent deployments to avoid conflicts

## How to Use the Form

1. **Personal Information**:
   - Enter your first name (Imię)
   - Enter your last name (Nazwisko)
   - Provide PESEL or ID number
   - Enter your phone number
   - Provide a valid email address
   - Enter your address

2. **Rental Period**:
   - **Pickup Date & Time**: Select when you want to pick up the equipment
   - **Return Date & Time**: Select when you plan to return it
   - Use the spinner buttons (▲▼) to adjust time in 15-minute increments
   - The form automatically validates that dates are not in the past and return date is not before pickup date

3. **Equipment Selection**:
   - Browse the list of available mountain equipment
   - Use quantity spinners or enter numbers directly
   - Add optional notes (e.g., shoe size for crampons)
   - Available equipment includes: Raki Koszykowe, Czekan, Kask, and more

4. **Submit**:
   - Review your information
   - Click "Wyślij" (Submit) button
   - Wait for confirmation page
   - The form data is sent to the webhook for processing

## Form Validation

The application includes comprehensive validation:
- All required fields must be filled
- Email must be in valid format
- Dates cannot be in the past
- Return date must be equal to or after pickup date
- Time fields are required
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

**Built with ❤️ using React, Vite, and modern web technologies**