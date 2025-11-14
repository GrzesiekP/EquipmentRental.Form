# Equipment Rental Form

A modern, responsive web application for managing equipment rental requests built with Vue.js 3. This application provides an intuitive interface for users to submit rental requests with automatic date validation, and formatted output.

## Features

- **Vue.js 3**: Built with Vue.js 3 for reactive, component-based architecture
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client Information**: Capture essential customer details (name, email, phone, address, PESEL/ID)
- **Equipment Selection**: Choose from various equipment types with quantity controls
- **Date Validation**: Prevents invalid rental periods (rental date cannot be before pickup date)
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **Modern UI**: Clean interface with smooth animations and user-friendly design
- **Export Functionality**: Submits formatted rental data to webhook endpoint

## Demo

Visit the live application: [https://grzesiekp.github.io/EquipmentRental.Form/](https://grzesiekp.github.io/EquipmentRental.Form/)

## Technologies Used

- **Vue.js 3**: Progressive JavaScript framework for building user interfaces
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **GitHub Pages**: Automated deployment via GitHub Actions

## Project Structure

```
EquipmentRental.Form/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for deployment
├── css/
│   └── style.css              # Application styles
├── js/
│   ├── settings.js            # Configuration (equipment items, webhook URL)
│   └── vue-app.js             # Vue.js application logic
├── assets/
│   └── logo.png               # Application logo
├── index.html                 # Main HTML file with Vue.js template
├── ARCHITECTURE.md            # Technical architecture documentation
└── README.md                  # This file
```

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/GrzesiekP/EquipmentRental.Form.git
   cd EquipmentRental.Form
   ```

2. **Open the application**
   - Simply open [`index.html`](index.html:1) in your web browser
   - Note: Vue.js is loaded from CDN, so an internet connection is required
   - For development, you can use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```
   - Then navigate to `http://localhost:8000`

3. **Configuration**
   - Edit `js/settings.js` to configure:
     - Webhook URL for form submission
     - Equipment items list

### Deployment to GitHub Pages

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

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
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repository-name>.git
   git push -u origin main
   ```

4. **Automatic deployment**:
   - The GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml:1)) will automatically trigger
   - Check the "Actions" tab in your repository to monitor deployment progress
   - Once complete, your site will be live at: `https://<your-username>.github.io/<repository-name>/`

#### Workflow Details

The deployment workflow:
- Triggers on every push to the `main` branch
- Builds and uploads the static site as an artifact
- Deploys to GitHub Pages
- Uses official GitHub Actions for reliability
- Prevents concurrent deployments to avoid conflicts

## How to Use the Form

1. **Client Information**:
   - Enter your full name
   - Provide a valid email address
   - Enter your phone number

2. **Equipment Selection**:
   - Choose equipment and specify quantity using the spinner controls
   - Equipment items are configured in `js/settings.js`

3. **Rental Period**:
   - **Pickup Date**: Select when you want to pick up the equipment
   - **Pickup Time**: Select the pickup time (with 15-minute increment spinners)
   - **Return Date**: Select when you plan to return it
   - **Return Time**: Select the return time (with 15-minute increment spinners)
   - The form automatically validates that the return date is after the pickup date

4. **Additional Information**:
   - Add notes for specific equipment items (e.g., boot size for crampons)

5. **Submit**:
   - Review your information
   - Click "Submit Rental Request"
   - View the formatted summary with total cost

5. **Reset** (optional):
   - Click "Reset Form" to clear all fields and start over

## Form Validation

The application includes comprehensive validation:
- All required fields must be filled
- Email must be in valid format
- Phone number is required
- PESEL or ID is required
- Dates cannot be in the past
- Return date must be after or equal to pickup date
- Time fields are required
- Helpful error messages guide you to correct any issues

## Cost Calculation

Equipment rental data is submitted to a webhook endpoint for processing. The webhook handles:
- Equipment availability checking
- Cost calculation based on rental duration
- Confirmation email generation

Configuration for the webhook URL can be found in `js/settings.js`.

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

**Built with Vue.js 3** ❤️