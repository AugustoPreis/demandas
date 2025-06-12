import { useState, useCallback, useMemo, useContext, createContext, useRef, useEffect } from 'react';
import { Snackbar, Alert, Box } from '@mui/material';

const MessageContext = createContext(null);

const INITIAL_TOP_OFFSET = 8;
const MESSAGE_GAP = 8;

export function useMessage() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [topPositions, setTopPositions] = useState({}); //Posições 'top' de cada mensagem
  const alertRefs = useRef({});

  useEffect(() => {
    const newPositions = {};
    let cumulativeHeight = INITIAL_TOP_OFFSET;

    messages.forEach(msg => {
      newPositions[msg.id] = cumulativeHeight;

      const alertElement = alertRefs.current[msg.id];

      if (alertElement) {
        cumulativeHeight += alertElement.offsetHeight + MESSAGE_GAP;
      }
    });

    setTopPositions(newPositions);
  }, [messages]);


  const addMessage = useCallback((text, severity = 'success', options = {}) => {
    const id = `${new Date().getTime()} - ${Math.random()}`;
    const { duration = 6000 } = options;

    setMessages((prevMessages) => [...prevMessages, { id, text, severity, duration }]);
  }, []);

  const removeMessage = (id, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if (!id) {
      setMessages([]);
      return;
    }

    setMessages((prevMessages) => {
      const newMessages = prevMessages.filter((msg) => msg.id !== id);

      delete alertRefs.current[id];

      return newMessages;
    });
  }

  const contextValue = useMemo(() => ({
    info: (text, options) => addMessage(text, 'info', options),
    error: (text, options) => addMessage(text, 'error', options),
    warning: (text, options) => addMessage(text, 'warning', options),
    success: (text, options) => addMessage(text, 'success', options),
    destroy: removeMessage,
  }), [addMessage]);

  return (
    <MessageContext.Provider value={contextValue}>
      <Box sx={{
        '@keyframes progressBar': {
          '0%': { transform: 'scaleX(1)' },
          '100%': { transform: 'scaleX(0)' },
        },
      }} />
      {children}
      {messages.map((msg) => (
        <Snackbar key={msg.id}
          open={true}
          autoHideDuration={msg.duration}
          onClose={(_, reason) => removeMessage(msg.id, reason)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          style={{ top: `${topPositions[msg.id] || INITIAL_TOP_OFFSET}px` }}>
          <Alert variant='filled'
            ref={el => (alertRefs.current[msg.id] = el)}
            onClose={() => removeMessage(msg.id)}
            severity={msg.severity}
            sx={{
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              whiteSpace: 'pre-wrap',
            }}>
            {msg.text}
            <Box component='div'
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.5)',
                transformOrigin: 'left',
                animation: `progressBar ${msg.duration / 1000}s linear`,
              }} />
          </Alert>
        </Snackbar>
      ))}
    </MessageContext.Provider>
  );
}