import { TextField, Typography, Box, Grid, IconButton, InputAdornment } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { incrementTime, decrementTime } from '../utils';

function RentalDatesSection({ formData, onChange, disabled }) {
  const handleTimeIncrement = (fieldName) => {
    const newTime = incrementTime(formData[fieldName]);
    onChange({ target: { name: fieldName, value: newTime } });
  };

  const handleTimeDecrement = (fieldName) => {
    const newTime = decrementTime(formData[fieldName]);
    onChange({ target: { name: fieldName, value: newTime } });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Termin wynajmu
      </Typography>
      
      <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 2 }}>
        Odbiór
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Data odbioru"
            name="pickupDate"
            type="date"
            value={formData.pickupDate}
            onChange={onChange}
            required
            fullWidth
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Godzina odbioru"
            name="pickupHour"
            type="time"
            value={formData.pickupHour}
            onChange={onChange}
            required
            fullWidth
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleTimeIncrement('pickupHour')}
                      disabled={disabled}
                      aria-label="Zwiększ godzinę"
                      sx={{ p: 0, height: '20px' }}
                    >
                      <ArrowDropUp fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleTimeDecrement('pickupHour')}
                      disabled={disabled}
                      aria-label="Zmniejsz godzinę"
                      sx={{ p: 0, height: '20px' }}
                    >
                      <ArrowDropDown fontSize="small" />
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 2 }}>
        Zwrot
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Data zwrotu"
            name="returnDate"
            type="date"
            value={formData.returnDate}
            onChange={onChange}
            required
            fullWidth
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Godzina zwrotu"
            name="returnHour"
            type="time"
            value={formData.returnHour}
            onChange={onChange}
            required
            fullWidth
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleTimeIncrement('returnHour')}
                      disabled={disabled}
                      aria-label="Zwiększ godzinę"
                      sx={{ p: 0, height: '20px' }}
                    >
                      <ArrowDropUp fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleTimeDecrement('returnHour')}
                      disabled={disabled}
                      aria-label="Zmniejsz godzinę"
                      sx={{ p: 0, height: '20px' }}
                    >
                      <ArrowDropDown fontSize="small" />
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RentalDatesSection;
