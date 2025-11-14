import { 
  Typography, 
  Box, 
  TextField, 
  IconButton, 
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { SETTINGS } from '../settings';
import { equipmentNameToId } from '../utils';

function EquipmentSection({ equipment, onChange, disabled }) {
  const handleQuantityChange = (itemId, value) => {
    const numValue = parseInt(value, 10) || 0;
    onChange(itemId, 'quantity', numValue);
  };

  const handleQuantityIncrement = (itemId) => {
    const currentQuantity = equipment[itemId]?.quantity || 0;
    onChange(itemId, 'quantity', currentQuantity + 1);
  };

  const handleQuantityDecrement = (itemId) => {
    const currentQuantity = equipment[itemId]?.quantity || 0;
    if (currentQuantity > 0) {
      onChange(itemId, 'quantity', currentQuantity - 1);
    }
  };

  const handleCommentsChange = (itemId, value) => {
    onChange(itemId, 'comments', value);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Wybór sprzętu
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Proszę podać ilość rezerwowanego sprzętu. W uwagach można podać numer buta w przypadku rezerwacji raków lub raczków.
      </Typography>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Sprzęt</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Ilość</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Uwagi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SETTINGS.equipmentItems.map((item) => {
              const itemId = equipmentNameToId(item);
              const quantity = equipment[itemId]?.quantity || 0;
              const comments = equipment[itemId]?.comments || '';
              
              return (
                <TableRow key={itemId}>
                  <TableCell>{item}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(itemId, e.target.value)}
                      size="small"
                      fullWidth
                      disabled={disabled}
                      InputProps={{
                        inputProps: { min: 0, style: { textAlign: 'center' } },
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityDecrement(itemId)}
                              disabled={disabled || quantity === 0}
                              aria-label="Zmniejsz ilość"
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityIncrement(itemId)}
                              disabled={disabled}
                              aria-label="Zwiększ ilość"
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={comments}
                      onChange={(e) => handleCommentsChange(itemId, e.target.value)}
                      size="small"
                      fullWidth
                      disabled={disabled}
                      placeholder="Dodaj uwagi"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default EquipmentSection;
