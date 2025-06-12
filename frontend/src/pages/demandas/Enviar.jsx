import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Grid, Box, Button, FormControl } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import Loading from '../../components/Loading';
import { useMessage } from '../../components/MessageProvider';
import DataSelect from '../../components/DataSelect';

export default function Enviar() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const message = useMessage();
  const { id } = useParams();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      situacao: null,
      usuario: null,
    },
  });

  useEffect(() => {
    document.title = 'Envio de Demanda';
  }, []);

  const handleEnviar = (values) => {
    setLoading(true);

    const body = {
      demandaId: id,
      situacaoId: values.situacao?.id,
      usuarioId: values.usuario?.id,
    };

    axios.put(`/v1/demandas/${id}/enviar`, body)
      .then(() => {
        navigate('/demandas');
      }).catch((error) => {
        setLoading(false);
        message.error(error.response?.data?.message || 'Erro ao enviar a demanda');
      });
  }

  return (
    <Box p={2}>
      <Loading loading={loading}>
        <form onSubmit={handleSubmit(handleEnviar)}>
          <Grid container
            spacing={2}>
            <Grid size={{ lg: 4, md: 6, sm: 7, xs: 12 }}>
              <FormControl fullWidth>
                <Controller name='usuario'
                  control={control}
                  render={({ field }) => (
                    <DataSelect {...field}
                      label='Usuário Destino'
                      url='/v1/usuarios'
                      labelKey='nome' />
                  )} />
              </FormControl>
            </Grid>
            <Grid size={{ lg: 4, md: 6, sm: 5, xs: 12 }}>
              <FormControl fullWidth>
                <Controller name='situacao'
                  control={control}
                  render={({ field }) => (
                    <DataSelect {...field}
                      label='Situação'
                      url='/v1/situacoes'
                      labelKey='descricao' />
                  )} />
              </FormControl>
            </Grid>
          </Grid>
          <Box mt={4}
            display='flex'
            justifyContent='space-between'>
            <Button variant='outlined'
              startIcon={<KeyboardBackspace />}
              onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button variant='contained'
              type='submit'
              startIcon={<KeyboardBackspace style={{ rotate: '180deg' }} />}>
              Enviar
            </Button>
          </Box>
        </form>
      </Loading>
    </Box>
  );
}