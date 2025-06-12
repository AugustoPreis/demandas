import { useState } from 'react';
import { Popover, Typography, Button, Box } from '@mui/material';

export default function Popconfirm({ title, children, onConfirm }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleConfirm = () => {
    onConfirm?.();
    handleClose();
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <div onClick={(e) => setAnchorEl(e.currentTarget)}>
        {children}
      </div>
      <Popover id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ mb: 2 }}>{title}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='small'
              onClick={handleClose}>
              Cancelar
            </Button>
            <Button size='small'
              color='primary'
              onClick={handleConfirm}
              sx={{ ml: 1 }}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
}