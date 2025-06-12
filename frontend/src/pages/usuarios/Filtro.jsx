import { PersonAdd } from '@mui/icons-material';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useUsuariosContext } from './Context';

export default function Filtro({ filtro, setFiltro }) {
  const { onUsuario } = useUsuariosContext();

  const changeFiltro = (value, key) => {
    setFiltro({ ...filtro, [key]: value });
  }

  return (
    <Box my={4}>
      <Grid container
        spacing={2}
        justifyContent='space-between'>
        <Grid size={{ xl: 4, lg: 5, md: 6, sm: 7, xs: 12 }}>
          <TextField label='Nome'
            size='small'
            value={filtro.descricao || ''}
            slotProps={{ htmlInput: { maxLength: 100 } }}
            onChange={(e) => changeFiltro(e.target.value, 'descricao')} />
        </Grid>
        <Grid size={{ xl: 2, md: 3, sm: 5, xs: 12 }}>
          <Button fullWidth
            variant='contained'
            endIcon={<PersonAdd />}
            onClick={() => onUsuario(null, 'cadastrar')}>
            Cadastrar Usuário
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}