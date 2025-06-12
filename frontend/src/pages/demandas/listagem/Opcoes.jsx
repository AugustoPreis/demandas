import { Grid, IconButton, Tooltip } from '@mui/material';
import { Visibility, Handyman, Send, Stop } from '@mui/icons-material';
import { useDemandasContext } from '../Context';

export default function Opcoes({ trabalhando, demanda }) {
  const { onIniciarTrabalho, onPararTrabalho, onVisualizar, onEnviar } = useDemandasContext();

  return (
    <Grid container
      spacing={1}
      mt={{ xs: 1, sm: 0 }}
      justifyContent='end'>
      <Grid>
        <IconButton onClick={() => onVisualizar(demanda)}>
          <Tooltip title='Visualizar'>
            <Visibility />
          </Tooltip>
        </IconButton>
      </Grid>
      <Grid>
        {trabalhando ? (
          <IconButton color='error'
            onClick={() => onPararTrabalho(demanda)}>
            <Tooltip title='Parar trabalho'>
              <Stop />
            </Tooltip>
          </IconButton>
        ) : (
          <IconButton color='info'
            onClick={() => onIniciarTrabalho(demanda)}>
            <Tooltip title='Trabalhar'>
              <Handyman />
            </Tooltip>
          </IconButton>
        )}
      </Grid>
      <Grid>
        <IconButton color='info'
          onClick={() => onEnviar(demanda)}>
          <Tooltip title='Enviar'>
            <Send />
          </Tooltip>
        </IconButton>
      </Grid>
    </Grid>
  );
}