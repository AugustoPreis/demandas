import { Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { formatPrioridadeDemanda } from '../../../utils/formatters';
import Show from '../../../components/Show';
import Titulo from './Titulo';
import Infos from './Infos';
import Opcoes from './Opcoes';

export default function ItemListagem({ demanda, trabalhando }) {
  //Quando não tiver demanda sendo trabalhada, mostra um card vazio para evitar quebras de layout
  if (trabalhando && !demanda) {
    return (
      <Card>
        <CardContent style={{ padding: 40 }}>
          <Grid container
            justifyContent='center'>
            <Typography variant='h5'>
              Nenhuma demanda sendo trabalhada no momento
            </Typography>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Card>
        <CardContent style={{ padding: 16 }}>
          <Grid container
            mb={1}
            spacing={1}>
            <Show visible={trabalhando}>
              <Chip size='small'
                color='secondary'
                style={{ fontWeight: 'bold' }}
                label='Trabalhando agora' />
            </Show>
            <Chip color='primary'
              size='small'
              style={{ fontWeight: 'bold' }}
              label={demanda.situacao?.descricao} />
            <Chip size='small'
              style={{ fontWeight: 'bold' }}
              label={formatPrioridadeDemanda(demanda.prioridade) + ' Prioridade'} />
          </Grid>
          <Grid container
            spacing={1}
            alignItems='center'>
            <Grid size={{ xl: 7, lg: 7, md: 5, xs: 12 }}>
              <Titulo demanda={demanda} />
            </Grid>
            <Grid size={{ xl: 3, lg: 3, md: 4, sm: 8, xs: 12 }}>
              <Infos demanda={demanda} />
            </Grid>
            <Grid size={{ xl: 2, lg: 2, md: 3, sm: 4, xs: 12 }}>
              <Opcoes trabalhando={trabalhando}
                demanda={demanda} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}