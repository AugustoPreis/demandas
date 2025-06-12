import { Grid, IconButton, Tooltip } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import Popconfirm from '../../../components/Popconfirm';
import { useUsuariosContext } from '../Context';

export default function Opcoes({ usuario }) {
  const { onUsuario, onDeletar } = useUsuariosContext();

  return (
    <Grid container
      spacing={1}
      mt={{ xs: 1, sm: 0 }}
      justifyContent='end'>
      <Grid>
        <IconButton onClick={() => onUsuario(usuario, 'visualizar')}>
          <Tooltip title='Visualizar'>
            <Visibility />
          </Tooltip>
        </IconButton>
      </Grid>
      <Grid>
        <IconButton color='primary'
          onClick={() => onUsuario(usuario, 'editar')}>
          <Tooltip title='Editar'>
            <Edit />
          </Tooltip>
        </IconButton>
      </Grid>
      <Grid>
        <IconButton color='error'>
          <Popconfirm title='Deseja remover?'
            onConfirm={() => onDeletar(usuario.id)}>
            <Tooltip title='Remover'>
              <Delete />
            </Tooltip>
          </Popconfirm>
        </IconButton>
      </Grid>
    </Grid>
  );
}