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
  TableRow,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { SETTINGS } from '../settings';
import { equipmentNameToId } from '../utils';

function EquipmentSection({ equipment, onChange, disabled }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const quantityInput = (itemId, quantity) => (
    <TextField
      type="number"
      value={quantity}
      onChange={(e) => handleQuantityChange(itemId, e.target.value)}
      size="small"
      disabled={disabled}
      fullWidth={isMobile}
      sx={{
        '& .MuiInputAdornment-root': {
          flexShrink: 0
        },
        '& .MuiInputBase-input': {
          textAlign: 'center'
        }
      }}
      InputProps={{
        inputProps: { min: 0 },
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
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Wybór sprzętu
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Proszę podać ilość rezerwowanego sprzętu. W uwagach można podać numer buta w przypadku rezerwacji raków lub raczków.
      </Typography>
      
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SETTINGS.equipmentItems.map((item) => {
            const itemId = equipmentNameToId(item);
            const quantity = equipment[itemId]?.quantity || 0;
            const comments = equipment[itemId]?.comments || '';
            
            return (
              <Paper key={itemId} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                  {item}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                    Ilość
                  </Typography>
                  {quantityInput(itemId, quantity)}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                    Uwagi
                  </Typography>
                  <TextField
                    value={comments}
                    onChange={(e) => handleCommentsChange(itemId, e.target.value)}
                    size="small"
                    fullWidth
                    disabled={disabled}
                    placeholder="Dodaj uwagi"
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Sprzęt</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ilość</TableCell>
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
                      {quantityInput(itemId, quantity)}
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
      )}
    </Box>
  );
}

export default EquipmentSection;
