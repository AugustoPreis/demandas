import { useState } from 'react';
import { Fab, Typography } from '@mui/material';

export default function FloatingButton({ text, children, ...props }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Fab {...props}
      color='primary'
      variant='extended'
      onMouseLeave={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
      sx={(theme) => ({
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
        paddingY: theme.spacing(3.5),
      })}>
      <Typography variant='button'
        sx={{ textTransform: 'none', fontSize: '1rem' }}>
        {hovered && text}
      </Typography>
      {children}
    </Fab>
  );
}