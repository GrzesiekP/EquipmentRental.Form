import { TextField, Typography, Box } from '@mui/material';

function PersonalInfoSection({ formData, onChange, disabled }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Dane osobowe
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Imię"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          fullWidth
          disabled={disabled}
          autoComplete="given-name"
        />
        <TextField
          label="Nazwisko"
          name="surname"
          value={formData.surname}
          onChange={onChange}
          required
          fullWidth
          disabled={disabled}
          autoComplete="family-name"
        />
        <TextField
          label="PESEL lub ID"
          name="peselOrdId"
          value={formData.peselOrdId}
          onChange={onChange}
          required
          fullWidth
          disabled={disabled}
        />
        <TextField
          label="Telefon"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          required
          fullWidth
          disabled={disabled}
          autoComplete="tel"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          required
          fullWidth
          disabled={disabled}
          autoComplete="email"
        />
        <TextField
          label="Adres"
          name="address"
          value={formData.address}
          onChange={onChange}
          required
          fullWidth
          disabled={disabled}
          autoComplete="street-address"
        />
      </Box>
    </Box>
  );
}

export default PersonalInfoSection;
