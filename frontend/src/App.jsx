import ptBR from 'date-fns/locale/pt-BR';
import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './auth/AuthContext';
import Router from './Router';
import { MessageProvider } from './components/MessageProvider';

const theme = createTheme({
  components: {
    MuiTextField: { styleOverrides: { root: { width: '100%' } } },
    MuiSelect: { styleOverrides: { root: { width: '100%' } } },
  },
});

export default function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}
      adapterLocale={ptBR}>
      <ThemeProvider theme={theme}>
        <MessageProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </MessageProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}