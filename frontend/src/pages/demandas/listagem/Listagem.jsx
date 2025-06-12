import { Card, Grid, Pagination, Typography } from '@mui/material';
import { Inbox } from '@mui/icons-material';
import { useDemandasContext } from '../Context';
import ItemListagem from './ItemListagem';

export default function Listagem({ demandas }) {
  const { paginacao, changePagina } = useDemandasContext();

  if (!Array.isArray(demandas) || !demandas.length) {
    return (
      <Card>
        <Grid container
          py={6}
          rowSpacing={2}
          flexDirection='column'
          alignItems='center'>
          <Inbox sx={{ fontSize: 48, color: 'gray.500' }} />
          <Typography variant='h5'
            color='text.secondary'>
            Nenhuma demanda encontrada
          </Typography>
        </Grid>
      </Card>
    );
  }

  return (
    <Grid container
      flexDirection='column'
      alignItems='end'
      rowSpacing={1}>
      {demandas.map((demanda) => (
        <ItemListagem key={demanda.id}
          demanda={demanda} />
      ))}
      <Pagination count={Math.ceil(paginacao.total / 10)}
        sx={{ paddingTop: 1 }}
        shape='rounded'
        page={paginacao.pagina}
        onChange={(_, page) => changePagina(page)} />
    </Grid>
  );
}