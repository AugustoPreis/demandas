import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TextField, CircularProgress, Autocomplete } from '@mui/material';
import { logMessage } from '../utils/logger';

export default function DataSelect({ label, labelKey, url, onChange, ...props }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchOptions = useCallback((searchTerm, currentPage) => {
    setLoading(true);

    axios.get(url, {
      params: {
        descricao: searchTerm,
        pagina: currentPage,
      },
    }).then((response) => {
      const nOptions = [...response.data.data];
      const total = Number(response.data.total);

      setHasMore(total > (options.length + nOptions.length));
      setOptions((prevOptions) => (currentPage === 1 ? nOptions : [...prevOptions, ...nOptions]));
    }).catch((error) => {
      logMessage('Erro:', error.response?.data?.message || 'Erro ao buscar dados');
      setHasMore(false);
    }).finally(() => {
      setLoading(false);
    });
  }, [url]);

  useEffect(() => {
    if (!open) {
      setLoading(false);

      return;
    }

    setLoading(true);

    // Limpa o estado antes de buscar novos dados
    const timeout = setTimeout(() => {
      setPage(1);
      setOptions([]);
      fetchOptions(inputValue, 1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputValue, fetchOptions, open]);

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
    setInputValue('');
    setPage(1);
    setHasMore(true);
  }

  const onScroll = (event) => {
    const listboxNode = event.currentTarget;
    const isAtBottom = listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1;

    //Adiciona um item no final da lista para indicar o loading de mais itens
    if (isAtBottom && hasMore && !loading) {
      const nextPage = page + 1;

      setPage(nextPage);
      fetchOptions(inputValue, nextPage);
    }
  }

  return (
    <Autocomplete {...props}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={handleClose}
      options={options}
      inputValue={inputValue}
      getOptionLabel={(option) => option[labelKey]}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={loading && options.length === 0}
      loadingText='Buscando itens...'
      onChange={(_, value) => onChange(value)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      slotProps={{ listbox: { onScroll } }}
      renderOption={(props, option) => (
        <li {...props}
          key={option.id}>
          {option[labelKey]}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params}
          label={label}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && options.length === 0 ? (
                    <CircularProgress size={20}
                      color='inherit' />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }} />
      )} />
  );
}