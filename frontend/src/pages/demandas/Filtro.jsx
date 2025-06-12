import { Box, FormControl, Grid, TextField } from '@mui/material';
import DataSelect from '../../components/DataSelect';

export default function Filtro({ filtro, setFiltro }) {

  const changeFiltro = (value, key) => {
    setFiltro({ ...filtro, [key]: value });
  }

  return (
    <Box my={4}>
      <Grid container
        spacing={2}>
        <Grid size={{ xl: 1, lg: 2, md: 3, sm: 3, xs: 4 }}>
          <TextField label='Nº'
            size='small'
            type='number'
            value={filtro.numero || ''}
            onChange={(e) => changeFiltro(e.target.value, 'numero')} />
        </Grid>
        <Grid size={{ xl: 4, lg: 5, md: 6, sm: 5, xs: 8 }}>
          <TextField label='Título/Descrição'
            size='small'
            value={filtro.descricao || ''}
            slotProps={{ htmlInput: { maxLength: 100 } }}
            onChange={(e) => changeFiltro(e.target.value, 'descricao')} />
        </Grid>
        <Grid size={{ xl: 2, lg: 2, md: 3, sm: 4, xs: 12 }}>
          <FormControl fullWidth>
            <DataSelect label='Situação'
              size='small'
              url='/v1/situacoes'
              labelKey='descricao'
              value={filtro.situacao || null}
              onChange={(value) => changeFiltro(value, 'situacao')} />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}