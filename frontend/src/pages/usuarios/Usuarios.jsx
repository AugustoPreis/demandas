import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import { KeyboardBackspace } from '@mui/icons-material';
import Filtro from './Filtro';
import Loading from '../../components/Loading';
import { useMessage } from '../../components/MessageProvider';
import Listagem from './listagem/Listagem';
import { UsuariosContext } from './Context';

export default function Usuarios() {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [paginacao, setPaginacao] = useState({ pagina: 1 });
  const navigate = useNavigate();
  const message = useMessage();

  useEffect(() => {
    document.title = 'Listagem de Usuários';
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 350);

    return () => clearTimeout(timeout);
  }, [filtro]);

  const fetchData = (pagina = 1) => {
    setLoading(true);

    const params = {
      pagina,

      descricao: filtro.descricao,
    };

    axios.get('/v1/usuarios', {
      params,
    }).then((response) => {
      const { data, total } = response.data;

      setUsuarios(data || []);
      setPaginacao({ pagina, total: total });
    }).catch((error) => {
      message.error(error.response?.data?.message || 'Erro ao carregar usuários');
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleDelete = (id) => {
    setLoading(true);

    axios.delete(`/v1/usuarios/${id}`)
      .then(() => {
        fetchData();
      }).catch((error) => {
        message.error(error.response?.data?.message || 'Erro ao deletar usuário');
        setLoading(false);
      });
  }

  const handleAction = (usuario, acao) => {
    const keys = ['/usuarios'];

    if (usuario) {
      keys.push(usuario.id);
    }

    if (acao) {
      keys.push(acao);
    }

    navigate(keys.join('/'));
  }

  const changePagina = (pagina) => {
    fetchData(pagina);
  }

  return (
    <Box padding={2}>
      <UsuariosContext.Provider value={{
        paginacao,
        onUsuario: handleAction,
        onDeletar: handleDelete,
        changePagina,
      }}>
        <Button variant='outlined'
          startIcon={<KeyboardBackspace />}
          onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Filtro filtro={filtro}
          setFiltro={setFiltro} />
        <Loading loading={loading}>
          <Listagem usuarios={usuarios} />
        </Loading>
      </UsuariosContext.Provider>
    </Box>
  );
}