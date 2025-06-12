import { Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import Opcoes from './Opcoes';
import Show from '../../../components/Show';

export default function ItemListagem({ usuario }) {

  return (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardContent style={{ padding: 16 }}>
          <Show visible={usuario.adm}>
            <Grid container
              mb={1}
              spacing={1}>
              <Chip color='primary'
                size='small'
                style={{ fontWeight: 'bold' }}
                label='Administrador' />
            </Grid>
          </Show>
          <Grid container
            spacing={1}
            alignItems='center'>
            <Grid size={{ xl: 10, lg: 10, md: 9, sm: 8, xs: 12 }}>
              <Typography variant='h6'>
                {usuario.nome}
              </Typography>
            </Grid>
            <Grid size={{ xl: 2, lg: 2, md: 3, sm: 4, xs: 12 }}>
              <Opcoes usuario={usuario} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}