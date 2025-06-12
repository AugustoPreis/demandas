import { Box, Typography } from '@mui/material';

export default function LabeledText({ label, children, variant = 'body2' }) {
  return (
    <Box>
      <Typography variant={variant}
        sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant={variant}>
        {children}
      </Typography>
    </Box>
  );
}