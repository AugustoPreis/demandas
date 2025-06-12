import { Alert, Snackbar } from '@mui/material';

export default function ErrorMessage({ error, onClose }) {

  return (
    <Snackbar open={!!error}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={6000}
      onClose={onClose}>
      <Alert onClose={onClose}
        severity='error'
        sx={{ width: '100%', border: '1px solid #f44336' }}>
        {error}
      </Alert>
    </Snackbar>
  );
}