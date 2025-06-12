import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import Loading from '../../components/Loading';
import { useMessage } from '../../components/MessageProvider';
import FloatingButton from '../../components/FloatingButton';
import ItemListagem from './listagem/ItemListagem';
import Listagem from './listagem/Listagem';
import { DemandasContext } from './Context';
import Filtro from './Filtro';

export default function Demandas() {
  const [loading, setLoading] = useState(false);
  const [demandas, setDemandas] = useState([]);
  const [trabalhandoAgora, setTrabalhandoAgora] = useState(null);
  const [filtro, setFiltro] = useState({});
  const [paginacao, setPaginacao] = useState({ pagina: 1 });
  const navigate = useNavigate();
  const message = useMessage();

  useEffect(() => {
    document.title = 'Listagem de Demandas';
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

      numero: filtro.numero,
      descricao: filtro.descricao,
      situacaoId: filtro.situacao?.id,
      mostrarHoras: true,
      mostrarTrabalhandoAgora: true,

      //TODO
      ordem: null,
    };

    axios.get('/v1/demandas', {
      params,
    }).then((response) => {
      const { data, total, trabalhandoAgora } = response.data;

      setDemandas(data || []);
      setTrabalhandoAgora(trabalhandoAgora || null);
      setPaginacao({ pagina, total: total });
    }).catch((error) => {
      message.error(error.response?.data?.message || 'Erro ao buscar demandas');
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleIniciarTrabalho = (demanda) => {
    axios.post(`/v1/demandas/${demanda.id}/iniciar-trabalho`)
      .then(() => {
        fetchData();
      }).catch((error) => {
        message.error(error.response?.data?.message || 'Erro ao iniciar trabalho');
      });
  }

  const handlePararTrabalho = (demanda) => {
    axios.put(`/v1/demandas/${demanda.id}/encerrar-trabalho`)
      .then(() => {
        fetchData();
      }).catch((error) => {
        message.error(error.response?.data?.message || 'Erro ao finalizar trabalho');
      });
  }

  const handleNovaDemanda = () => {
    navigate(`/demandas/cadastrar`);
  }

  const handleVisualizar = (demanda) => {
    navigate(`/demandas/${demanda.id}/visualizar`);
  }

  const handleEnviar = (demanda) => {
    navigate(`/demandas/${demanda.id}/enviar`);
  }

  const changePagina = (pagina) => {
    fetchData(pagina);
  }

  return (
    <Box padding={2}>
      <DemandasContext.Provider value={{
        paginacao,
        trabalhandoAgora,
        onIniciarTrabalho: handleIniciarTrabalho,
        onPararTrabalho: handlePararTrabalho,
        onVisualizar: handleVisualizar,
        onEnviar: handleEnviar,
        changePagina,
      }}>
        <ItemListagem trabalhando
          demanda={trabalhandoAgora} />
        <Filtro filtro={filtro}
          setFiltro={setFiltro} />
        <Loading loading={loading}>
          <Listagem demandas={demandas} />
          <FloatingButton text='Nova Demanda'
            onClick={handleNovaDemanda}>
            <Add />
          </FloatingButton>
        </Loading>
      </DemandasContext.Provider>
    </Box>
  );
}