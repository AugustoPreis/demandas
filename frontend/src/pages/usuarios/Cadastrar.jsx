import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Grid, TextField, Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useMessage } from '../../components/MessageProvider';
import Loading from '../../components/Loading';
import Show from '../../components/Show';

export default function Cadastrar() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const message = useMessage();
  const { id, acao } = useParams();

  const { control, reset, handleSubmit } = useForm({
    disabled: acao === 'visualizar',
    defaultValues: {
      nome: '',
      email: '',
      observacoes: '',
      adm: false,
      escolheDemandas: true,
    },
  });

  useEffect(() => {
    switch (acao) {
      case 'visualizar':
        document.title = 'Cadastro de Usuário';
        break;
      case 'cadastrar':
        document.title = 'Cadastro de Usuário';
        break;
      case 'editar':
        document.title = 'Alteração de Usuário';
        break;
    }

    fetchData();
  }, []);

  const fetchData = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    axios.get(`/v1/usuarios/${id}`)
      .then(({ data }) => {
        reset({
          nome: data.nome || '',
          email: data.email || '',
          observacoes: data.observacoes || '',
          adm: !!data.adm,
          escolheDemandas: !!data.escolheDemandas,
        });
      }).catch((error) => {
        message.error(error.response?.data?.message || 'Erro ao buscar usuário');
      }).finally(() => {
        setLoading(false);
      });
  }

  const handleSave = (values) => {
    setLoading(true);

    axios.post('/v1/usuarios', {
      ...values,
    }).then(() => {
      message.success('Usuário salvo com sucesso');
      handleClose();
    }).catch((error) => {
      setLoading(false);
      message.error(error.response?.data?.message || 'Erro ao cadastrar usuário');
    });
  }

  const handleUpdate = (values) => {
    setLoading(true);

    axios.put(`/v1/usuarios/${id}`, {
      ...values,
    }).then(() => {
      message.success('Usuário atualizado com sucesso');
      handleClose();
    }).catch((error) => {
      setLoading(false);
      message.error(error.response?.data?.message || 'Erro ao atualizar usuário');
    });
  }

  const handleClose = () => {
    navigate(-1);
  }

  const onFormSubmit = () => {
    if (acao === 'cadastrar') {
      return handleSubmit(handleSave);
    }

    if (acao === 'editar') {
      return handleSubmit(handleUpdate);
    }

    if (acao === 'visualizar') {
      return handleSubmit(handleClose);
    }
  }

  return (
    <Box p={2}>
      <Loading loading={loading}>
        <form onSubmit={onFormSubmit()}>
          <Grid container
            spacing={2}>
            <Grid size={{ xl: 4, lg: 6, md: 8, xs: 12 }}>
              <Controller name='nome'
                control={control}
                render={({ field }) => (
                  <TextField {...field}
                    fullWidth
                    label='Nome'
                    variant='outlined' />
                )} />
            </Grid>
            <Grid container
              size={{ xl: 8, lg: 6, md: 4, xs: 12 }}>
              <FormControlLabel label='Administrador'
                control={
                  <Controller name='adm'
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)} />
                    )} />
                } />
              <FormControlLabel label='Escolhe demandas'
                control={
                  <Controller name='escolheDemandas'
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)} />
                    )} />
                } />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name='observacoes'
                control={control}
                render={({ field }) => (
                  <TextField {...field}
                    multiline
                    minRows={3}
                    fullWidth
                    label='Observações'
                    variant='outlined' />
                )} />
            </Grid>
            <Show visible={['visualizar', 'cadastrar'].includes(acao)}>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Controller name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field}
                      fullWidth
                      label='Email'
                      type='email'
                      variant='outlined' />
                  )} />
              </Grid>
            </Show>
            <Show visible={acao === 'cadastrar'}>
              <Grid size={{ xl: 4, md: 6, xs: 12 }}>
                <Controller name='senha'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field}
                      fullWidth
                      label='Senha'
                      type='password'
                      variant='outlined' />
                  )} />
              </Grid>
            </Show>
          </Grid>
          <Box mt={4}
            display='flex'
            justifyContent='space-between'>
            <Button variant='outlined'
              startIcon={<KeyboardBackspace />}
              onClick={handleClose}>
              {acao === 'visualizar' ? 'Voltar' : 'Cancelar'}
            </Button>
            <Show visible={acao !== 'visualizar'}>
              <Button variant='contained'
                type='submit'>
                Salvar {id ? ' Alterações' : ''}
              </Button>
            </Show>
          </Box>
        </form>
      </Loading>
    </Box>
  );
}