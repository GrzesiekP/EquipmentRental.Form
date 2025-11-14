import { Container, Box, Typography, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

function SuccessPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f9fafb' }}>
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            Formularz wynajmu sprzętu
          </Typography>
          
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
            <Typography variant="h5" component="h2" gutterBottom color="success.main">
              Formularz wysłany pomyślnie
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Formularz wysłany pomyślnie. Prosimy czekać na wiadomość z potwierdzeniem rezerwacji.
            </Typography>
          </Box>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; 2025 Formularz wynajmu sprzętu
        </Typography>
      </Container>
    </Box>
  );
}

export default SuccessPage;
