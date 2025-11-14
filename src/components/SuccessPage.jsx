import { Container, Box, Typography, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

function SuccessPage() {
  return (
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
          
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 4, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <CheckCircle sx={{ fontSize: { xs: 60, sm: 80 }, color: 'success.main' }} />
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              color="success.main"
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Formularz wysłany pomyślnie
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 1, sm: 0 }
              }}
            >
              Formularz wysłany pomyślnie. Prosimy czekać na wiadomość z potwierdzeniem rezerwacji.
            </Typography>
          </Box>
        </Paper>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          &copy; 2025 Formularz wynajmu sprzętu
        </Typography>
      </Container>
    </Box>
  );
}

export default SuccessPage;
