import { useState } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Link
} from '@mui/material';
import { SETTINGS } from './settings';
import { formatSubmitDate, formatTime, formatDateInput } from './utils';
import { validateForm } from './validation';
import PersonalInfoSection from './components/PersonalInfoSection';
import RentalDatesSection from './components/RentalDatesSection';
import EquipmentSection from './components/EquipmentSection';
import SuccessPage from './components/SuccessPage';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#059669',
    },
  },
});

function App() {
  // Calculate default dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    peselOrdId: '',
    phone: '',
    email: '',
    address: '',
    pickupDate: formatDateInput(tomorrow),
    pickupHour: '16:00',
    returnDate: formatDateInput(dayAfterTomorrow),
    returnHour: '16:00',
    equipment: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 'success' or 'error'
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle equipment changes
  const handleEquipmentChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [itemId]: {
          ...(prev.equipment[itemId] || { quantity: 0, comments: '' }),
          [field]: value
        }
      }
    }));
  };

  // Submit to webhook
  const submitToWebhook = async (data) => {
    try {
      const response = await fetch(SETTINGS.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        status: response.status,
        data: await response.json().catch(() => ({}))
      };
    } catch (error) {
      console.error('Webhook submission error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hide any existing feedback
    setFeedbackMessage('');
    setFeedbackType('');

    // Collect equipment data
    const equipment = [];
    SETTINGS.equipmentItems.forEach(item => {
      const itemId = item.toLowerCase().replace(/\s+/g, '-');
      const equipmentData = formData.equipment[itemId] || { quantity: 0, comments: '' };
      const quantity = parseInt(equipmentData.quantity, 10) || 0;
      const comments = equipmentData.comments.trim();

      // Only include items with quantity > 0 OR comments provided
      if (quantity > 0 || comments !== '') {
        equipment.push({
          type: item,
          quantity: quantity,
          comments: comments !== '' ? comments : null
        });
      }
    });

    // Create the data object with formatted timestamp
    const submitData = {
      submitDate: formatSubmitDate(new Date()),
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      peselOrdId: formData.peselOrdId.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate,
      pickupHour: formatTime(formData.pickupHour),
      returnHour: formatTime(formData.returnHour),
      equipment: equipment
    };

    // Validate the data
    const validation = validateForm(submitData);
    if (!validation.isValid) {
      setFeedbackMessage(validation.message);
      setFeedbackType('error');
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    // Submit to webhook
    const result = await submitToWebhook(submitData);

    // Remove loading state
    setIsSubmitting(false);

    // Handle result
    if (result.success && result.status >= 200 && result.status < 300) {
      // Show success page for all success statuses (200-299)
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setFeedbackMessage('Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.');
      setFeedbackType('error');
    }
  };

  if (showSuccess) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SuccessPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f9fafb' }}>
        <Container 
          maxWidth="md" 
          sx={{ 
            flex: 1, 
            py: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 3 }
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mb: { xs: 2, sm: 4 }, 
              bgcolor: 'white' 
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Formularz wynajmu sprzętu
            </Typography>
            
            <Box 
              sx={{ 
                mb: 4, 
                p: { xs: 1.5, sm: 2 }, 
                bgcolor: '#f0f9ff', 
                borderRadius: 1 
              }}
            >
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Dzień dobry,
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                w celu dokonania rezerwacji sprzętu proszę wypełnić poniższy formularz - są to dane potrzebne do zawarcia umowy wypożyczenia.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Dostępny sprzęt i cennik: <Link href="https://kaukazwypozyczalnia.pl/cennik" target="_blank" rel="noopener noreferrer">https://kaukazwypozyczalnia.pl/cennik</Link>
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Grzegorz Pawłowski,<br />
                Wypożyczalnia Kaukaz
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <PersonalInfoSection
                formData={formData}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              
              <RentalDatesSection
                formData={formData}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              
              <EquipmentSection
                equipment={formData.equipment}
                onChange={handleEquipmentChange}
                disabled={isSubmitting}
              />
              
              {feedbackMessage && (
                <Alert 
                  severity={feedbackType === 'error' ? 'error' : 'success'}
                  sx={{ mb: 3 }}
                >
                  {feedbackMessage}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{ 
                    maxWidth: { xs: '100%', sm: 300 }
                  }}
                >
                  {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
                </Button>
              </Box>
            </Box>
          </Paper>
          
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; 2025 Formularz wynajmu sprzętu
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
