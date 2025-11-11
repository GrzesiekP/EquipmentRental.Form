# Equipment Rental Form

A modern, responsive web application for managing equipment rental requests. This application provides an intuitive interface for users to submit rental requests with automatic date validation, cost calculation, and formatted output.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client Information**: Capture essential customer details (name, email, phone)
- **Equipment Selection**: Choose from various equipment types with automatic cost calculation
- **Date Validation**: Prevents invalid rental periods (rental date cannot be before pickup date)
- **Automatic Calculations**: 
  - Daily rental cost based on equipment type
  - Total rental days calculation
  - Overall rental cost computation
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **Modern UI**: Clean interface with smooth animations and user-friendly design
- **Export Functionality**: Generate formatted rental summary

## Demo

Visit the live application: [https://&lt;your-username&gt;.github.io/&lt;repository-name&gt;/](https://github.com/&lt;your-username&gt;/&lt;repository-name&gt;)

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: Pure JavaScript for form handling and validation
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
│   └── app.js                 # Application logic
├── index.html                 # Main HTML file
├── ARCHITECTURE.md            # Technical architecture documentation
└── README.md                  # This file
```

## Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<repository-name>.git
   cd <repository-name>
   ```

2. **Open the application**
   - Simply open [`index.html`](index.html:1) in your web browser
   - No build process or dependencies required!
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
   - Choose the type of equipment you need
   - Equipment costs per day:
     - Excavator: $500/day
     - Bulldozer: $600/day
     - Crane: $800/day
     - Forklift: $150/day
     - Concrete Mixer: $100/day

3. **Rental Period**:
   - **Pickup Date**: Select when you want to pick up the equipment
   - **Return Date**: Select when you plan to return it
   - The form automatically validates that the return date is after the pickup date

4. **Submit**:
   - Review your information
   - Click "Submit Rental Request"
   - View the formatted summary with total cost

5. **Reset** (optional):
   - Click "Reset Form" to clear all fields and start over

## Form Validation

The application includes comprehensive validation:
- All fields are required
- Email must be in valid format
- Phone number must contain at least 10 digits
- Return date must be after pickup date
- Helpful error messages guide you to correct any issues

## Cost Calculation

The application automatically calculates:
- **Number of rental days**: (Return Date - Pickup Date)
- **Total cost**: Daily Rate × Number of Days

Example: Renting a Crane for 5 days = $800/day × 5 days = $4,000

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

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**