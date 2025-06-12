import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

export default function Titulo({ demanda }) {
  //Mostra descricao apenas quando não tiver quebra de linha
  const descricao = useMemo(() => {
    if (typeof demanda.descricao !== 'string' || demanda.descricao.trim() === '') {
      return '';
    }

    if (!demanda.descricao.includes('\n')) {
      return demanda.descricao;
    }

    return 'Abra a demanda para visualizar a descrição completa.';
  }, [demanda.descricao]);

  return (
    <Box>
      <Typography variant='h6'>
        {demanda.numero}/{new Date(demanda.dataCadastro).getFullYear()} - {demanda.titulo}
      </Typography>
      <Typography variant='caption'>
        {descricao}
      </Typography>
    </Box>
  );
}