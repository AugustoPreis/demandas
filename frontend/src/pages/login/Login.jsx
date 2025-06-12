import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Button, Card, CardContent, FormControl, Grid, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../../auth/AuthContext';
import { useMessage } from '../../components/MessageProvider';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const message = useMessage();
  const { login } = useAuth();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      usuario: '',
      senha: '',
    },
  });

  const handleLogin = (values) => {
    setLoading(true);

    axios.post('/v1/usuarios/login', {
      usuario: values.usuario,
      senha: values.senha,
    }).then((response) => {
      login(response.data);
      message.success('Login realizado com sucesso', { duration: 3000 });
      navigate('/demandas');
    }).catch((error) => {
      setLoading(false);
      message.error(error.response?.data?.message || 'Erro ao realizar login');
    });
  }

  return (
    <Grid container
      justifyContent='center'
      alignItems='center'
      style={{ height: '100vh' }}>
      <Grid size={{ lg: 4, md: 5, sm: 8, xs: 11 }}>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(handleLogin)}>
              <Grid container
                spacing={2}>
                <Grid size={{ xs: 12 }}
                  mt={2}
                  mb={4}>
                  <Typography variant='h4' align='center'>
                    Login
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <Controller name='usuario'
                      control={control}
                      render={({ field }) => (
                        <TextField {...field}
                          label='Nome de Usuário' />
                      )} />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <Controller name='senha'
                      control={control}
                      render={({ field }) => (
                        <TextField {...field}
                          type='password'
                          label='Senha' />
                      )} />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type='submit'
                    variant='contained'
                    loading={loading}
                    fullWidth>
                    Entrar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}