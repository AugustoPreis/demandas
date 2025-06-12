import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Avatar, Box, Card, CardContent, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { ExitToApp, Menu as MenuIcon, ListAlt, Group } from '@mui/icons-material';
import { logMessage } from '../utils/logger';
import { useAuth } from '../auth/AuthContext';
import Show from './Show';

export default function Cabecalho() {
  const [infos, setInfos] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    axios.interceptors.response.use((response) => response, (error) => {
      // Unauthorized
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }

      // Forbidden
      if (error.response?.status === 403) {
        navigate('/demandas');
      }

      return Promise.reject(error);
    });

    fetchData();
  }, []);

  const fetchData = () => {
    //TODO: Verificar possibilidade de adicionar socket para atualizar em tempo real a quantidade de demandas
    axios.get(`/v1/usuarios/${user?.id}/infos`)
      .then((response) => {
        setInfos(response.data);
      }).catch((error) => {
        logMessage(`Erro ao buscar informações do usuário: ${error.response?.data?.message}`);
      });
  }

  const handleLogout = () => {
    axios.delete('/v1/usuarios/login')
      .catch((error) => {
        logMessage(`Erro ao fazer logout: ${error.response?.data?.message}`);
      }).finally(() => {
        logout();
        navigate('/login');
      });
  }

  const toggleDrawer = (e, open) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  }

  return (
    <React.Fragment>
      <Drawer anchor='left'
        open={drawerOpen}
        onClose={(e) => toggleDrawer(e, false)}>
        <Box role='presentation'
          sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <List onClick={(e) => toggleDrawer(e, false)}
            onKeyDown={(e) => toggleDrawer(e, false)}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/demandas')}>
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary='Demandas' />
              </ListItemButton>
            </ListItem>
            <Show visible={user?.adm}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/usuarios')}>
                  <ListItemIcon>
                    <Group />
                  </ListItemIcon>
                  <ListItemText primary='Gerenciamento de Usuários' />
                </ListItemButton>
              </ListItem>
            </Show>
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Box onClick={(e) => toggleDrawer(e, false)}
            onKeyDown={(e) => toggleDrawer(e, false)}>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp color='error' />
                  </ListItemIcon>
                  <ListItemText primary='Sair' />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box padding={2}>
        <Card elevation={3}>
          <CardContent style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            paddingLeft: 8,
          }}>
            <Box display='flex'
              pl={2}
              alignItems='center'>
              <IconButton color='inherit'
                aria-label='open drawer'
                onClick={(e) => toggleDrawer(e, true)}
                edge='start'
                sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
              <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
              <Box>
                <Typography variant='h6'>
                  {infos.usuario?.nome || 'Usuário'}
                </Typography>
                <Typography variant='body2'
                  color='text.secondary'>
                  {infos.demandas?.total || 0} Demanda(s)
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
}