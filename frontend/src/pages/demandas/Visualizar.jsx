import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Grid, TextField, MenuItem, Box, Select, InputLabel, FormControl, Button } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useForm, Controller } from 'react-hook-form';
import Loading from '../../components/Loading';
import { useMessage } from '../../components/MessageProvider';

export default function Visualizar() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const message = useMessage();
  const { id } = useParams();

  const { control, reset } = useForm({
    defaultValues: {
      numero: '',
      cliente: '',
      dataCadastro: null,
      dataPrevisao: null,
      prioridade: '',
      situacao: '',
      horasTrabalhadas: '',
      titulo: '',
      descricao: '',
    },
  });

  useEffect(() => {
    document.title = 'Visualização de Demanda';

    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    axios.get(`/v1/demandas/${id}`)
      .then(({ data }) => {
        reset({
          numero: data.numero,
          cliente: data.cliente?.nome || '',
          situacao: data.situacao?.descricao || '',
          dataCadastro: data.dataCadastro ? new Date(data.dataCadastro) : null,
          dataPrevisao: data.dataPrevisao ? new Date(data.dataPrevisao) : null,
          prioridade: data.prioridade || '',
          horasTrabalhadas: data.horasTrabalhadas || '',
          titulo: data.titulo || '',
          descricao: data.descricao || '',
        });
      }).catch((error) => {
        message.error(error.response?.data?.message || 'Erro ao buscar demanda');
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <Box p={2}>
      <Loading loading={loading}>
        <Grid container
          spacing={2}>
          <Grid size={{ lg: 2, md: 3, sm: 3, xs: 12 }}>
            <Controller name='numero'
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label='Número'
                  fullWidth
                  variant='outlined'
                  slotProps={{ input: { readOnly: true } }} />
              )} />
          </Grid>
          <Grid size={{ lg: 4, md: 9, sm: 9, xs: 12 }}>
            <Controller name='cliente'
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label='Cliente'
                  fullWidth
                  variant='outlined'
                  slotProps={{ input: { readOnly: true } }} />
              )} />
          </Grid>
          <Grid size={{ lg: 2, md: 6, sm: 6, xs: 12 }}>
            <Controller name='dataCadastro'
              control={control}
              render={({ field }) => (
                <DatePicker {...field}
                  label='Cadastro'
                  readOnly
                  slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }} />
              )} />
          </Grid>
          <Grid size={{ lg: 2, md: 6, sm: 6, xs: 12 }}>
            <Controller name='dataPrevisao'
              control={control}
              render={({ field }) => (
                <DatePicker {...field}
                  label='Previsão'
                  readOnly
                  slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }} />
              )} />
          </Grid>
          <Grid size={{ lg: 2, md: 4, sm: 4, xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Controller name='prioridade'
                control={control}
                render={({ field }) => (
                  <Select {...field}
                    label='Prioridade'
                    readOnly>
                    <MenuItem value='BAIXA'>Baixa</MenuItem>
                    <MenuItem value='MEDIA'>Média</MenuItem>
                    <MenuItem value='ALTA'>Alta</MenuItem>
                  </Select>
                )} />
            </FormControl>
          </Grid>
          <Grid size={{ lg: 2, md: 4, sm: 4, xs: 12 }}>
            <FormControl fullWidth>
              <Controller name='situacao'
                control={control}
                render={({ field }) => (
                  <TextField {...field}
                    label='Situação'
                    fullWidth
                    variant='outlined'
                    slotProps={{ input: { readOnly: true } }} />
                )} />
            </FormControl>
          </Grid>
          <Grid size={{ lg: 2, md: 4, sm: 4, xs: 12 }}>
            <Controller name='horasTrabalhadas'
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label='Horas Trabalhadas'
                  fullWidth
                  variant='outlined'
                  slotProps={{ input: { readOnly: true } }} />
              )} />
          </Grid>
          <Grid size={{ lg: 8, md: 12, sm: 12, xs: 12 }}>
            <Controller name='titulo'
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label='Título'
                  fullWidth
                  variant='outlined'
                  slotProps={{ input: { readOnly: true } }} />
              )} />
          </Grid>
          <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <Controller name='descricao'
              control={control}
              render={({ field }) => (
                <TextField {...field}
                  label='Descrição'
                  multiline
                  minRows={3}
                  fullWidth
                  variant='outlined'
                  slotProps={{ input: { readOnly: true } }} />
              )} />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Button variant='contained'
            onClick={() => navigate('/demandas')}
            startIcon={<KeyboardBackspace />}>
            Voltar
          </Button>
        </Box>
      </Loading>
    </Box>
  );
}