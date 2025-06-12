import { Card, Grid, Pagination, Typography } from '@mui/material';
import { Inbox } from '@mui/icons-material';
import { useUsuariosContext } from '../Context';
import ItemListagem from './ItemListagem';

export default function Listagem({ usuarios }) {
  const { paginacao, changePagina } = useUsuariosContext();

  if (!Array.isArray(usuarios) || !usuarios.length) {
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
            Nenhum usuário encontrado
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
      {usuarios.map((usuario) => (
        <ItemListagem key={usuario.id}
          usuario={usuario} />
      ))}
      <Pagination count={Math.ceil(paginacao.total / 10)}
        sx={{ paddingTop: 1 }}
        shape='rounded'
        page={paginacao.pagina}
        onChange={(_, page) => changePagina(page)} />
    </Grid>
  );
}