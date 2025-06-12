import { Box, CircularProgress } from '@mui/material';

export default function Spin({ loading, children }) {
  return (
    <Box position='relative'>
      {loading && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.6)',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1,
        }}>
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ opacity: loading ? 0.5 : 1 }}>
        {children}
      </Box>
    </Box>
  );
}
