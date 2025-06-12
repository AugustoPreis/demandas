import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Grid, TextField, Box, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useForm, Controller } from 'react-hook-form';
import { useMessage } from '../../components/MessageProvider';
import DataSelect from '../../components/DataSelect';
import Loading from '../../components/Loading';

export default function Cadastrar() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const message = useMessage();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      titulo: '',
      descricao: '',
      prioridade: 'BAIXA',
      dataPrevisao: null,
      situacao: null,
      cliente: null,
      usuario: null,
    },
  });

  const handleSave = (values) => {
    setLoading(true);

    const body = {
      titulo: values.titulo,
      descricao: values.descricao,
      prioridade: values.prioridade,
      dataPrevisao: values.dataPrevisao?.toISOString(),
      situacaoId: values.situacao?.id,
      clienteId: values.cliente?.id,
      usuarioId: values.usuario?.id,
    };

    axios.post('/v1/demandas', {
      ...body,
    }).then((response) => {
      const { usuario, numero, dataCadastro } = response.data;
      let textoMensagem = `Demanda ${numero}/${new Date(dataCadastro).getFullYear()} `;

      if (usuario) {
        message.success(textoMensagem + `encaminhada para ${usuario.nome}`);
      } else {
        message.success(textoMensagem + 'cadastrada com sucesso');
      }
      handleClose();
    }).catch((error) => {
      setLoading(false);
      message.error(error.response?.data?.message || 'Erro ao cadastrar demanda');
    });
  }

  const handleClose = () => {
    navigate(-1);
  }

  return (
    <Box p={2}>
      <Loading loading={loading}>
        <form onSubmit={handleSubmit(handleSave)}>
          <Grid container
            spacing={2}>
            <Grid size={{ xl: 6, lg: 6, md: 8, sm: 12, xs: 12 }}>
              <Controller name='titulo'
                control={control}
                render={({ field }) => (
                  <TextField {...field}
                    fullWidth
                    label='Título'
                    variant='outlined'
                    slotProps={{ htmlInput: { maxLength: 100 } }} />
                )} />
            </Grid>
            <Grid size={{ xl: 3, lg: 3, md: 4, sm: 4, xs: 12 }}>
              <Controller name='situacao'
                control={control}
                render={({ field }) => (
                  <DataSelect {...field}
                    label='Situação'
                    url='/v1/situacoes'
                    labelKey='descricao' />
                )} />
            </Grid>
            <Grid size={{ xl: 3, lg: 3, md: 2, sm: 8, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Controller name='prioridade'
                  control={control}
                  render={({ field }) => (
                    <Select {...field}
                      label='Prioridade'>
                      <MenuItem value='BAIXA'>Baixa</MenuItem>
                      <MenuItem value='MEDIA'>Média</MenuItem>
                      <MenuItem value='ALTA'>Alta</MenuItem>
                    </Select>
                  )} />
              </FormControl>
            </Grid>
            <Grid size={{ xl: 4, lg: 4, md: 6, sm: 12, xs: 12 }}>
              <Controller name='cliente'
                control={control}
                render={({ field }) => (
                  <DataSelect {...field}
                    label='Cliente'
                    url='/v1/clientes'
                    labelKey='nome' />
                )} />
            </Grid>
            <Grid size={{ xl: 2, lg: 2, md: 4, sm: 4, xs: 12 }}>
              <Controller name='dataPrevisao'
                control={control}
                render={({ field }) => (
                  <DatePicker {...field}
                    label='Previsão'
                    slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }} />
                )} />
            </Grid>
            <Grid size={{ xl: 6, lg: 6, md: 6, sm: 8, xs: 12 }}>
              <Controller name='usuario'
                control={control}
                render={({ field }) => (
                  <DataSelect {...field}
                    label='Usuário Destino'
                    url='/v1/usuarios'
                    labelKey='nome' />
                )} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name='descricao'
                control={control}
                render={({ field }) => (
                  <TextField {...field}
                    label='Descrição'
                    multiline
                    minRows={3}
                    fullWidth
                    variant='outlined' />
                )} />
            </Grid>
          </Grid>
          <Box mt={4}
            display='flex'
            justifyContent='space-between'>
            <Button variant='outlined'
              startIcon={<KeyboardBackspace />}
              onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant='contained'
              type='submit'>
              Salvar
            </Button>
          </Box>
        </form>
      </Loading>
    </Box>
  );
}